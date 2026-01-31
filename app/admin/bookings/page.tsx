'use client';

import { useState } from 'react';
import { useData } from '@/components/providers/DataProvider';
import {
    Loader2, Calendar, User, Bike, Mail, Phone, Tag,
    MoreVertical, CheckCircle, Clock, XCircle, PlayCircle,
    FileText, Trash2, Edit2, ChevronDown, MapPin, Hash, X, Save
} from 'lucide-react';

export default function BookingsManagement() {
    const { bookings, updateBooking, deleteBooking, createBilling, loading } = useData();
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [editingBooking, setEditingBooking] = useState<any>(null);

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

    const handleSaveEdit = async () => {
        setUpdatingId(editingBooking._id);
        try {
            await updateBooking(editingBooking._id, editingBooking);
            setEditingBooking(null);
        } catch (err) {
            alert('Failed to update booking');
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

            {/* Edit Modal */}
            {editingBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black">Edit Booking</h3>
                            <button onClick={() => setEditingBooking(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-500">Customer Name</label>
                                <input
                                    value={editingBooking.customerName}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, customerName: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-500">Phone Number</label>
                                <input
                                    value={editingBooking.phoneNumber}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, phoneNumber: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-500">Vehicle Type</label>
                                <select
                                    value={editingBooking.vehicleType}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, vehicleType: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                                >
                                    <option value="bike">Bike</option>
                                    <option value="scooter">Scooter</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-500">Vehicle Number</label>
                                <input
                                    value={editingBooking.vehicleNumber || ''}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, vehicleNumber: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                                    placeholder="MH 12 AB 1234"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-500">Brand</label>
                                <input
                                    value={editingBooking.bikeBrand}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, bikeBrand: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-500">Model</label>
                                <input
                                    value={editingBooking.bikeModel}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, bikeModel: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-zinc-500">Address</label>
                                <textarea
                                    value={editingBooking.address || ''}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, address: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600 h-24 resize-none"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-zinc-500">Notes</label>
                                <textarea
                                    value={editingBooking.notes || ''}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600 h-24 resize-none"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleSaveEdit}
                                disabled={updatingId === editingBooking._id}
                                className="flex-1 bg-red-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                                {updatingId === editingBooking._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditingBooking(null)}
                                className="px-8 bg-zinc-100 text-zinc-500 font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {bookings.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200">
                        <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-zinc-900">No bookings found</h3>
                        <p className="text-zinc-500">New bookings will appear here once customers start booking.</p>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <div key={booking._id} className="p-6 bg-white rounded-2xl border border-zinc-200 hover:shadow-lg transition-all group">
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
                                    <div className="flex flex-col gap-1 text-sm text-zinc-500">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-3.5 h-3.5" />
                                            <span>{booking.serviceType}</span>
                                        </div>
                                        {booking.vehicleNumber && (
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-3.5 h-3.5" />
                                                <span className="font-mono uppercase">{booking.vehicleNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-[150px]">
                                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Status & Date</div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-medium text-zinc-900">
                                            {new Date(booking.bookingDate).toLocaleDateString(undefined, {
                                                weekday: 'short', month: 'short', day: 'numeric'
                                            })}
                                        </p>
                                        <div className="relative group/status w-fit">
                                            <button className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 transition-all ${statusColors[booking.status]}`}>
                                                {updatingId === booking._id ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : booking.status}
                                                <ChevronDown className="w-2.5 h-2.5" />
                                            </button>

                                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-10 p-2">
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
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => setEditingBooking(booking)}
                                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Edit Booking"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
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

                            {(booking.address || booking.notes) && (
                                <div className="mt-4 grid md:grid-cols-2 gap-4">
                                    {booking.address && (
                                        <div className="p-3 bg-red-50/30 rounded-xl text-xs text-zinc-600 border border-red-100/50 flex gap-3">
                                            <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                                            <div>
                                                <span className="font-bold text-zinc-900 block mb-1">Pickup Address:</span>
                                                {booking.address}
                                            </div>
                                        </div>
                                    )}
                                    {booking.notes && (
                                        <div className="p-3 bg-zinc-50 rounded-xl text-xs text-zinc-500 border border-zinc-100">
                                            <span className="font-bold text-zinc-900 block mb-1">Customer Notes:</span>
                                            {booking.notes}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
