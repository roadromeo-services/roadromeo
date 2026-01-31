import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    customerName: string;
    phoneNumber: string;
    email?: string;
    bikeBrand: string;
    bikeModel: string;
    serviceType: string;
    bookingDate: Date;
    status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
    totalAmount: number;
    notes?: string;
}

const BookingSchema: Schema = new Schema({
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    bikeBrand: { type: String, required: true },
    bikeModel: { type: String, required: true },
    serviceType: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    totalAmount: { type: Number, required: true, default: 0 },
    notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
