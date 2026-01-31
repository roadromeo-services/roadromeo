'use client';

import { useState } from 'react';
import { useData } from '@/components/providers/DataProvider';
import {
    Loader2, Calendar, User, Bike, Mail, Phone, Tag,
    MoreVertical, CheckCircle, Clock, XCircle, PlayCircle,
    FileText, Trash2, Edit2, ChevronDown
} from 'lucide-react';

export default function BookingsManagement() {
    const { bookings, updateBooking, deleteBooking, createBilling, loading } = useData();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleStatusChange = async (id: string, status: string) => {
        setUpdatingId(id);
        try {
            await updateBooking(id, { status });
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleGenerateInvoice = async (booking: any) => {
        if (!confirm(`Generate invoice for ${booking.customerName}?`)) return;

        try {
            await createBilling({
                bookingId: booking._id,
                items: [
                    { description: booking.serviceType, quantity: 1, price: booking.totalAmount }
                ],
                totalAmount: booking.totalAmount,
                paymentStatus: 'pending'
            });
            alert('Invoice generated successfully! View it in the Billing section.');
        } catch (err) {
            alert('Failed to generate invoice');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;
        try {
            await deleteBooking(id);
        } catch (err) {
            alert('Failed to delete booking');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            </div>
        );
    }

    const statusColors: any = {
        pending: 'bg-orange-100 text-orange-600',
        confirmed: 'bg-blue-100 text-blue-600',
        'in-progress': 'bg-purple-100 text-purple-600',
        completed: 'bg-green-100 text-green-600',
        cancelled: 'bg-red-100 text-red-600',
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-zinc-900">Bookings</h2>
                    <p className="text-zinc-500">Manage customer appointments and service lifecycle.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {bookings.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200">
                        <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-zinc-900">No bookings found</h3>
                        <p className="text-zinc-500">New bookings will appear here once customers start booking.</p>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <div key={booking._id} className="p-6 bg-white rounded-2xl border border-zinc-200 hover:shadow-lg transition-all">
                            <div className="flex flex-wrap gap-6 items-center">
                                <div className="flex-1 min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className="w-4 h-4 text-red-600" />
                                        <h4 className="font-bold text-zinc-900">{booking.customerName}</h4>
                                    </div>
                                    <div className="flex flex-col gap-1 text-sm text-zinc-500">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5" />
                                            <span>{booking.phoneNumber}</span>
                                        </div>
                                        {booking.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span>{booking.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Bike className="w-4 h-4 text-red-600" />
                                        <h4 className="font-bold text-zinc-900">{booking.bikeBrand} {booking.bikeModel}</h4>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                                        <Tag className="w-3.5 h-3.5" />
                                        <span>{booking.serviceType}</span>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-[150px]">
                                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Date</div>
                                    <p className="text-sm font-medium text-zinc-900">
                                        {new Date(booking.bookingDate).toLocaleDateString(undefined, {
                                            weekday: 'short', month: 'short', day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="relative group">
                                        <button className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter flex items-center gap-2 transition-all ${statusColors[booking.status]}`}>
                                            {updatingId === booking._id ? <Loader2 className="w-3 h-3 animate-spin" /> : booking.status}
                                            <ChevronDown className="w-3 h-3" />
                                        </button>

                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-2">
                                            {['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleStatusChange(booking._id, s)}
                                                    className="w-full text-left px-3 py-2 text-xs font-bold capitalize hover:bg-zinc-50 rounded-lg transition-colors"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleGenerateInvoice(booking)}
                                            className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            title="Generate Invoice"
                                        >
                                            <FileText className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(booking._id)}
                                            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Booking"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {booking.notes && (
                                <div className="mt-4 p-3 bg-zinc-50 rounded-xl text-xs text-zinc-500 border border-zinc-100">
                                    <span className="font-bold text-zinc-900 mr-2">Notes:</span>
                                    {booking.notes}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
