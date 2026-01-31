import mongoose, { Schema, Document } from 'mongoose';

export interface IBikeBrand extends Document {
    name: string;
    logo: string; // URL or key
    models: string[];
}

const BikeBrandSchema: Schema = new Schema({
    name: { type: String, required: true },
    logo: { type: String },
    models: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.BikeBrand || mongoose.model<IBikeBrand>('BikeBrand', BikeBrandSchema);
