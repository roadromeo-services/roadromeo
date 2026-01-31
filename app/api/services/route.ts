import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { getServerSession } from 'next-auth';

export async function GET() {
    await connectDB();
    const services = await Service.find({}).sort({ createdAt: 1 });
    return NextResponse.json(services);
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    const service = await Service.create(data);
    return NextResponse.json(service);
}
