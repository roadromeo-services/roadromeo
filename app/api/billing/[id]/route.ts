import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Billing from '@/models/Billing';
import { getServerSession } from 'next-auth';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const data = await req.json();

    try {
        const updatedBilling = await Billing.findByIdAndUpdate(id, data, { new: true });
        if (!updatedBilling) {
            return NextResponse.json({ error: 'Billing record not found' }, { status: 404 });
        }
        return NextResponse.json(updatedBilling);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    try {
        const deletedBilling = await Billing.findByIdAndDelete(id);
        if (!deletedBilling) {
            return NextResponse.json({ error: 'Billing record not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Billing record deleted successfully' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
