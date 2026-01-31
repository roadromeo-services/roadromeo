import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Pricing from '@/models/Pricing';
import { getServerSession } from 'next-auth';

export async function GET() {
    await connectDB();
    const pricing = await Pricing.find({}).sort({ price: 1 });
    return NextResponse.json(pricing);
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    const item = await Pricing.create(data);
    return NextResponse.json(item);
}
