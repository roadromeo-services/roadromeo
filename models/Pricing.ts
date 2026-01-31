import mongoose, { Schema, Document } from 'mongoose';

export interface IPricing extends Document {
    name: string;
    price: number;
    description: string;
    features: string[];
    popular: boolean;
    badge: string;
}

const PricingSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    popular: { type: Boolean, default: false },
    badge: { type: String },
}, { timestamps: true });

export default mongoose.models.Pricing || mongoose.model<IPricing>('Pricing', PricingSchema);
