import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Billing from '@/models/Billing';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const bills = await Billing.find({}).populate('bookingId').sort({ createdAt: -1 });
    return NextResponse.json(bills);
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    // Auto-generate invoice number if not provided
    if (!data.invoiceNumber) {
        data.invoiceNumber = `EST-${Date.now()}`;
    }

    const bill = await Billing.create(data);
    return NextResponse.json(bill);
}
