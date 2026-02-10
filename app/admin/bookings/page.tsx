'use client';

import { useState } from 'react';
import { useData } from '@/components/providers/DataProvider';
import {
    Loader2, Calendar, User, Bike, Mail, Phone, Tag,
    MoreVertical, CheckCircle, Clock, XCircle, PlayCircle,
    FileText, Trash2, Edit2, ChevronDown, MapPin, Hash, X, Save, Truck
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
                totalAmount: booking.totalAmount || 0,
                paymentStatus: 'pending',
                customerName: booking.customerName,
                phoneNumber: booking.phoneNumber,
                vehicleNumber: booking.vehicleNumber,
                address: booking.address,
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

    const statusConfig: Record<string, { bg: string; text: string; border: string; icon: any }> = {
        pending: { bg: 'bg-amber-500/15', text: 'text-amber-700', border: 'border-l-amber-500', icon: Clock },
        confirmed: { bg: 'bg-blue-500/15', text: 'text-blue-700', border: 'border-l-blue-500', icon: CheckCircle },
        'in-progress': { bg: 'bg-violet-500/15', text: 'text-violet-700', border: 'border-l-violet-500', icon: PlayCircle },
        completed: { bg: 'bg-emerald-500/15', text: 'text-emerald-700', border: 'border-l-emerald-500', icon: CheckCircle },
        cancelled: { bg: 'bg-red-500/15', text: 'text-red-700', border: 'border-l-red-500', icon: XCircle },
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
                                <label className="text-sm font-bold text-zinc-500">Pickup Service</label>
                                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer select-none transition-all duration-300 ${editingBooking.isPickup ? 'bg-emerald-50 border-emerald-200' : 'bg-zinc-50 border-zinc-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <Truck className={`w-5 h-5 transition-colors duration-300 ${editingBooking.isPickup ? 'text-emerald-600' : 'text-zinc-400'}`} />
                                        <span className="text-sm font-bold text-zinc-700">
                                            {editingBooking.isPickup ? 'Pickup & Drop enabled' : 'Walk-in (no pickup)'}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={editingBooking.isPickup || false}
                                            onChange={(e) => setEditingBooking({ ...editingBooking, isPickup: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-12 h-7 bg-zinc-200 rounded-full peer-checked:bg-emerald-500 transition-colors duration-300" />
                                        <div className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform duration-300" />
                                    </div>
                                </label>
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

            <div className="grid grid-cols-1 gap-5">
                {bookings.length === 0 ? (
                    <div className="p-16 text-center bg-white rounded-3xl border-2 border-dashed border-zinc-200">
                        <Calendar className="w-14 h-14 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-zinc-900 mb-1">No bookings yet</h3>
                        <p className="text-zinc-400 text-sm">New bookings will appear here once customers start booking.</p>
                    </div>
                ) : (
                    bookings.map((booking) => {
                        const status = statusConfig[booking.status] || statusConfig.pending;
                        const StatusIcon = status.icon;
                        return (
                            <div key={booking._id} className={`bg-white rounded-2xl border border-zinc-200 border-l-4 ${status.border} hover:shadow-lg transition-all overflow-hidden`}>
                                {/* Top Row: Key info + actions */}
                                <div className="p-5 pb-4">
                                    <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
                                        {/* Customer */}
                                        <div className="min-w-[180px]">
                                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Customer</p>
                                            <h4 className="font-bold text-zinc-900 text-base mb-1">{booking.customerName}</h4>
                                            <a href={`tel:${booking.phoneNumber}`} className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-red-600 transition-colors">
                                                <Phone className="w-3.5 h-3.5" />
                                                {booking.phoneNumber}
                                            </a>
                                            {booking.email && (
                                                <p className="flex items-center gap-1.5 text-sm text-zinc-500 mt-0.5">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {booking.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Vehicle */}
                                        <div className="min-w-[160px]">
                                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Vehicle</p>
                                            <h4 className="font-bold text-zinc-900 text-base mb-1">{booking.bikeBrand} {booking.bikeModel}</h4>
                                            {booking.vehicleNumber && (
                                                <p className="flex items-center gap-1.5 text-sm text-zinc-600">
                                                    <Hash className="w-3.5 h-3.5" />
                                                    <span className="font-mono font-semibold uppercase">{booking.vehicleNumber}</span>
                                                </p>
                                            )}
                                        </div>

                                        {/* Date & Badges */}
                                        <div className="min-w-[140px]">
                                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Booked</p>
                                            <p className="font-semibold text-zinc-900 text-sm">
                                                {new Date(booking.bookingDate).toLocaleDateString(undefined, {
                                                    weekday: 'short', month: 'short', day: 'numeric'
                                                })}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                {/* Status dropdown */}
                                                <div className="relative group/status">
                                                    <button className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wide ${status.bg} ${status.text}`}>
                                                        {updatingId === booking._id ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <StatusIcon className="w-3.5 h-3.5" />
                                                        )}
                                                        {booking.status}
                                                        <ChevronDown className="w-3 h-3 opacity-60" />
                                                    </button>
                                                    <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-zinc-200 rounded-xl shadow-2xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-10 p-1.5">
                                                        {['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((s) => {
                                                            const sc = statusConfig[s];
                                                            const SIcon = sc.icon;
                                                            return (
                                                                <button
                                                                    key={s}
                                                                    onClick={() => handleStatusChange(booking._id, s)}
                                                                    className={`w-full text-left px-3 py-2 text-xs font-bold capitalize rounded-lg transition-colors flex items-center gap-2 ${booking.status === s ? `${sc.bg} ${sc.text}` : 'hover:bg-zinc-50 text-zinc-600'}`}
                                                                >
                                                                    <SIcon className="w-3.5 h-3.5" />
                                                                    {s}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                {/* Pickup badge */}
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold ${booking.isPickup ? 'bg-emerald-500/15 text-emerald-700' : 'bg-zinc-200/60 text-zinc-500'}`}>
                                                    <Truck className="w-3.5 h-3.5" />
                                                    {booking.isPickup ? 'Pickup' : 'Walk-in'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions - always visible */}
                                        <div className="flex items-center gap-1 ml-auto">
                                            <button
                                                onClick={() => setEditingBooking(booking)}
                                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleGenerateInvoice(booking)}
                                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Invoice
                                            </button>
                                            <button
                                                onClick={() => handleDelete(booking._id)}
                                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row: Address & Notes */}
                                {(booking.address || booking.notes) && (
                                    <div className="px-5 pb-4 pt-0">
                                        <div className="grid md:grid-cols-2 gap-3 border-t border-zinc-100 pt-4">
                                            {booking.address && (
                                                <div className="flex gap-3 p-3 bg-red-50 rounded-xl text-sm">
                                                    <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-bold text-zinc-800 text-xs block mb-0.5">Pickup Address</span>
                                                        <span className="text-zinc-600 text-xs">{booking.address}</span>
                                                    </div>
                                                </div>
                                            )}
                                            {booking.notes && (
                                                <div className="flex gap-3 p-3 bg-zinc-100 rounded-xl text-sm">
                                                    <FileText className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-bold text-zinc-800 text-xs block mb-0.5">Notes</span>
                                                        <span className="text-zinc-600 text-xs">{booking.notes}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
