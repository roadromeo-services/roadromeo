import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const barcode = searchParams.get('barcode');
    const search = searchParams.get('search');

    if (barcode) {
        const product = await Product.findOne({ barcode });
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
    }

    if (search) {
        const products = await Product.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { barcode: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
            ]
        }).limit(10).sort({ name: 1 });
        return NextResponse.json(products);
    }

    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    const existing = await Product.findOne({ barcode: data.barcode });
    if (existing) {
        return NextResponse.json({ error: 'Product with this barcode already exists' }, { status: 409 });
    }

    const product = await Product.create(data);
    return NextResponse.json(product);
}
