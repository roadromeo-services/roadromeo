import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import ExcelJS from 'exceljs';

function worksheetToRows(worksheet: ExcelJS.Worksheet): Record<string, string>[] {
    const rows: Record<string, string>[] = [];
    const headers: string[] = [];
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
            row.eachCell((cell, colNumber) => {
                headers[colNumber] = String(cell.value ?? '').trim();
            });
            return;
        }
        const record: Record<string, string> = {};
        for (let i = 1; i <= headers.length; i++) {
            record[headers[i] || `col${i}`] = String(row.getCell(i).value ?? '').trim();
        }
        rows.push(record);
    });
    return rows;
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
        return NextResponse.json({ error: 'No worksheet found in file' }, { status: 400 });
    }

    const rows = worksheetToRows(worksheet);
    if (!rows.length) {
        return NextResponse.json({ error: 'No data found in file' }, { status: 400 });
    }

    // Normalize column names to match: bar_code, selling_price, cost_price
    const normalize = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

    const columnMap: Record<string, string> = {};
    for (const key of Object.keys(rows[0])) {
        const n = normalize(key);
        if (n.includes('barcode') || n.includes('bar')) columnMap['barcode'] = key;
        if (n.includes('selling') || n === 'price' || n === 'mrp') columnMap['sellingPrice'] = key;
        if (n.includes('cost') || n.includes('purchase')) columnMap['costPrice'] = key;
    }

    if (!columnMap['barcode']) {
        return NextResponse.json({ error: 'Could not find a "bar_code" or "barcode" column in the file.' }, { status: 400 });
    }

    const skipped: { row: number; reason: string }[] = [];
    let updated = 0;
    let notFound = 0;

    const updates: any[] = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const barcode = String(row[columnMap['barcode']] ?? '').trim();
        const sellingPrice = parseFloat(row[columnMap['sellingPrice']] ?? '');
        const costPrice = parseFloat(row[columnMap['costPrice']] ?? '');

        if (!barcode) {
            skipped.push({ row: i + 2, reason: 'Missing barcode' });
            continue;
        }

        const updateFields: any = {};
        if (!isNaN(sellingPrice)) updateFields.price = sellingPrice;
        if (!isNaN(costPrice)) updateFields.costPrice = costPrice;

        if (Object.keys(updateFields).length === 0) {
            skipped.push({ row: i + 2, reason: 'No valid price values found' });
            continue;
        }

        updates.push({
            updateOne: {
                filter: { barcode },
                update: { $set: updateFields },
            }
        });
    }

    if (updates.length > 0) {
        const result = await Product.bulkWrite(updates);
        updated = result.modifiedCount;
        notFound = result.matchedCount < updates.length ? updates.length - result.matchedCount : 0;
    }

    return NextResponse.json({
        success: updated > 0,
        total: rows.length,
        updated,
        notFound,
        skipped: skipped.length,
        skippedDetails: skipped.slice(0, 10),
    });
}
