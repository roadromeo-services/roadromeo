import mongoose, { Schema, Document } from 'mongoose';

export interface IBilling extends Document {
    invoiceNumber: string;
    customerName?: string;
    vehicleNumber?: string;
    address?: string;
    phoneNumber?: string;
    items?: {
        description: string;
        quantity: number;
        price: number;
    }[];
    tax: number;
    discount: number;
    totalAmount: number;
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentMethod?: string;
}

const BillingSchema: Schema = new Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    customerName: { type: String },
    vehicleNumber: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    items: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }
    }],
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentMethod: { type: String },
}, { timestamps: true });

// Delete cached model to ensure schema changes are picked up
if (mongoose.models.Billing) {
    delete mongoose.models.Billing;
}

export default mongoose.model<IBilling>('Billing', BillingSchema);
