import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { getServerSession } from 'next-auth';
import * as XLSX from 'xlsx';

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const contentType = req.headers.get('content-type') || '';

    let rows: Record<string, string>[] = [];

    if (contentType.includes('application/json')) {
        const body = await req.json();

        if (body.sheetUrl) {
            // Google Sheets — fetch CSV on server side (avoids CORS)
            let csvUrl = body.sheetUrl.trim();
            const sheetMatch = csvUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
            if (!sheetMatch) {
                return NextResponse.json({ error: 'Invalid Google Sheet URL. Paste the full URL from your browser.' }, { status: 400 });
            }
            const sheetId = sheetMatch[1];
            const gidMatch = csvUrl.match(/gid=(\d+)/);
            const gid = gidMatch ? gidMatch[1] : '0';
            csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

            const csvRes = await fetch(csvUrl, { redirect: 'follow' });
            if (!csvRes.ok) {
                return NextResponse.json({ error: `Failed to fetch Google Sheet (status ${csvRes.status}). Make sure it is shared as "Anyone with the link can view".` }, { status: 400 });
            }
            const csvText = await csvRes.text();

            // Check if Google returned an HTML page instead of CSV
            if (csvText.trimStart().startsWith('<!') || csvText.trimStart().startsWith('<html')) {
                return NextResponse.json({ error: 'Google returned an HTML page instead of CSV. Make sure the sheet is shared as "Anyone with the link can view".' }, { status: 400 });
            }

            const workbook = XLSX.read(csvText, { type: 'string' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '', raw: false });
        } else {
            rows = body.rows;
        }
    } else {
        // Excel file upload
        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '', raw: false });
    }

    if (!rows.length) {
        return NextResponse.json({ error: 'No data found' }, { status: 400 });
    }

    // Normalize column names (handle variations)
    const normalize = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

    const columnMap: Record<string, string> = {};
    const firstRow = rows[0];
    for (const key of Object.keys(firstRow)) {
        const n = normalize(key);
        if (n.includes('name') && !n.includes('email')) columnMap['name'] = key;
        if (n.includes('mobile') || n.includes('phone')) columnMap['phone'] = key;
        if (n.includes('email')) columnMap['email'] = key;
        if (n.includes('address')) columnMap['address'] = key;
        if (n.includes('registration') || n.includes('register')) columnMap['vehicleNumber'] = key;
        if ((n === 'vehicle' || n.includes('twowheeler') || n.includes('wheeler')) && !n.includes('registration') && !n.includes('register')) columnMap['vehicle'] = key;
        if (n.includes('timestamp') || n.includes('date')) columnMap['timestamp'] = key;
    }

    // Fetch existing phone+vehicleNumber combos to detect duplicates
    const existingBookings = await Booking.find(
        { notes: 'Imported from bulk upload' },
        { phoneNumber: 1, vehicleNumber: 1, _id: 1 }
    ).lean();
    const existingMap = new Map<string, string>(
        existingBookings.map((b: any) => [`${b.phoneNumber}|${(b.vehicleNumber || '').toLowerCase()}`, b._id.toString()])
    );

    const bookings = [];
    const updates = [];
    const skipped = [];
    const seenInBatch = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        const str = (val: unknown) => String(val ?? '').trim();
        const customerName = str(row[columnMap['name']]);
        const phoneNumber = str(row[columnMap['phone']]).replace(/\D/g, '').slice(-10);
        const email = str(row[columnMap['email']]);
        const address = str(row[columnMap['address']]);
        const vehicleNumber = str(row[columnMap['vehicleNumber']]);
        const vehicleInfo = str(row[columnMap['vehicle']]);
        const timestamp = str(row[columnMap['timestamp']]);

        if (!customerName || !phoneNumber || phoneNumber.length < 10) {
            skipped.push({ row: i + 2, reason: 'Missing name or valid phone number' });
            continue;
        }

        const dupeKey = `${phoneNumber}|${vehicleNumber.toLowerCase()}`;
        if (seenInBatch.has(dupeKey)) {
            skipped.push({ row: i + 2, reason: 'Duplicate in file (same phone + vehicle registration)' });
            continue;
        }
        seenInBatch.add(dupeKey);

        const bikeBrand = vehicleInfo || 'Unknown';
        const bikeModel = 'N/A';

        const lowerVehicle = vehicleInfo.toLowerCase();
        const vehicleType = (lowerVehicle.includes('scooter') || lowerVehicle.includes('activa') || lowerVehicle.includes('access') || lowerVehicle.includes('ntorq') || lowerVehicle.includes('jupiter') || lowerVehicle.includes('dio'))
            ? 'scooter' : 'bike';

        // Parse date — handle multiple formats
        let bookingDate: Date = new Date();
        if (timestamp) {
            // Excel serial number (e.g., 45372)
            const asNum = Number(timestamp);
            if (!isNaN(asNum) && asNum > 10000 && asNum < 100000) {
                bookingDate = new Date((asNum - 25569) * 86400 * 1000);
            } else {
                // Try DD/MM/YYYY or DD-MM-YYYY
                const ddmmyyyy = timestamp.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
                if (ddmmyyyy) {
                    bookingDate = new Date(`${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, '0')}-${ddmmyyyy[1].padStart(2, '0')}`);
                } else {
                    const parsed = new Date(timestamp);
                    if (!isNaN(parsed.getTime())) bookingDate = parsed;
                }
            }
        }

        const existingId = existingMap.get(dupeKey);
        if (existingId) {
            // Update existing record with latest timestamp
            updates.push({
                updateOne: {
                    filter: { _id: existingId },
                    update: { $set: { bookingDate, customerName, email: email || undefined, address: address || 'N/A', bikeBrand, vehicleType } },
                }
            });
        } else {
            bookings.push({
                customerName,
                phoneNumber,
                email: email || undefined,
                address: address || 'N/A',
                vehicleNumber: vehicleNumber || undefined,
                bikeBrand,
                bikeModel,
                vehicleType,
                bookingDate,
                status: 'completed',
                totalAmount: 0,
                notes: 'Imported from bulk upload',
            });
        }
    }

    let inserted = 0;
    let updated = 0;
    let dbError = '';

    if (updates.length > 0) {
        try {
            const result = await Booking.bulkWrite(updates);
            updated = result.modifiedCount;
        } catch (err: any) {
            dbError = err.message || 'Database update error';
        }
    }

    if (bookings.length > 0) {
        try {
            const result = await Booking.insertMany(bookings, { ordered: false });
            inserted = result.length;
        } catch (err: any) {
            inserted = err.insertedDocs?.length || 0;
            dbError = dbError || err.message || 'Database insert error';
        }
    }

    return NextResponse.json({
        success: inserted > 0 || updated > 0,
        inserted,
        updated,
        skipped: skipped.length,
        skippedDetails: skipped.slice(0, 10),
        total: rows.length,
        ...(dbError && { error: dbError }),
    });
}
