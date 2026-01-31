import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    name: string;
    slug: string;
    icon: string; // Store icon name as string
    shortDescription: string;
    description: string;
    price: number;
    duration: string;
    features: string[];
    popular: boolean;
}

const ServiceSchema: Schema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    features: [{ type: String }],
    popular: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
