import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const months = parseInt(searchParams.get('months') || '2');

    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);

    // Aggregate: group by phone number, get last booking per customer
    const customers = await Booking.aggregate([
        { $match: { status: { $in: ['completed', 'confirmed', 'in-progress'] } } },
        { $sort: { bookingDate: -1 } },
        {
            $group: {
                _id: '$phoneNumber',
                customerName: { $first: '$customerName' },
                phoneNumber: { $first: '$phoneNumber' },
                email: { $first: '$email' },
                lastBookingDate: { $first: '$bookingDate' },
                lastBikeBrand: { $first: '$bikeBrand' },
                lastBikeModel: { $first: '$bikeModel' },
                vehicleNumber: { $first: '$vehicleNumber' },
                totalBookings: { $sum: 1 },
                totalSpent: { $sum: '$totalAmount' },
            }
        },
        { $match: { lastBookingDate: { $lte: cutoffDate } } },
        { $sort: { lastBookingDate: 1 } }
    ]);

    // Debug: if ?debug=1, also return total bookings count and sample
    const debug = searchParams.get('debug');
    if (debug) {
        const total = await Booking.countDocuments({});
        const sample = await Booking.find({ notes: 'Imported from bulk upload' }).limit(3).select('customerName phoneNumber bookingDate bikeBrand').lean();
        return NextResponse.json({ customers, debug: { totalBookings: total, cutoffDate, sampleImported: sample } });
    }

    return NextResponse.json(customers);
}
