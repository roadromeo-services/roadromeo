import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    barcode: string;
    sku?: string;
    category: 'spare-part' | 'oil' | 'accessory' | 'consumable' | 'other';
    price: number;
    costPrice?: number;
    stock: number;
    unit: string;
    description?: string;
    minStock?: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    barcode: { type: String, required: true, unique: true },
    sku: { type: String },
    category: {
        type: String,
        enum: ['spare-part', 'oil', 'accessory', 'consumable', 'other'],
        default: 'other'
    },
    price: { type: Number, required: true },
    costPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'pcs' },
    description: { type: String },
    minStock: { type: Number, default: 5 },
}, { timestamps: true });

if (mongoose.models.Product) {
    delete mongoose.models.Product;
}

export default mongoose.model<IProduct>('Product', ProductSchema);
