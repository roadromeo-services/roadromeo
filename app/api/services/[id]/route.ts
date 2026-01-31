import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { getServerSession } from 'next-auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const service = await Service.findById(params.id);
    return NextResponse.json(service);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    const service = await Service.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(service);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    await Service.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' });
}
