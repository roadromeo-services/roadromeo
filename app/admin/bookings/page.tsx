'use client';

import { useData } from '@/components/providers/DataProvider';
import { Loader2, Calendar, User, Bike, Mail, Phone, Tag } from 'lucide-react';

export default function BookingsManagement() {
    const { bookings, loading } = useData();

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-black text-zinc-900">Bookings</h2>
                <p className="text-zinc-500">Manage customer appointments and service requests.</p>
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
                        <div key={booking._id} className="p-6 bg-white rounded-2xl border border-zinc-200 hover:shadow-lg transition-all flex flex-wrap gap-6 items-center">
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
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>

                            <div>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${booking.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                                            booking.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                'bg-zinc-100 text-zinc-600'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
