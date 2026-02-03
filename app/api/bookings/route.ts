import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    await connectDB();
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json(bookings);
}

export async function POST(req: Request) {
    // For bookings, we might want to allow public access (from the hero form)
    // but the user asked for booking api in context of admin panel, 
    // usually booking is created by customer.
    await connectDB();
    const data = await req.json();
    const booking = await Booking.create(data);
    return NextResponse.json(booking);
}
