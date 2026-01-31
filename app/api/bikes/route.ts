import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BikeBrand from '@/models/BikeBrand';
import { getServerSession } from 'next-auth';

export async function GET() {
    await connectDB();
    const bikes = await BikeBrand.find({}).sort({ name: 1 });
    return NextResponse.json(bikes);
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    const item = await BikeBrand.create(data);
    return NextResponse.json(item);
}
