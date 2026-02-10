'use client';

import { useMemo, useState } from 'react';
import { useData } from '@/components/providers/DataProvider';
import Link from 'next/link';
import {
    ClipboardList, Receipt, Wrench, Tag, Bike,
    IndianRupee, Clock, CheckCircle, PlayCircle, XCircle,
    TrendingUp, AlertTriangle, Plus, ArrowRight,
    Phone, Calendar, Loader2, Filter, X
} from 'lucide-react';

const MONTHS = [
    'All Months', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AdminDashboard() {
    const { services, pricing, bikes, bookings, billing, loading } = useData();

    // Filter state
    const [selectedMonth, setSelectedMonth] = useState(0); // 0 = All
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedVehicleType, setSelectedVehicleType] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');

    // Derive available years from booking + billing dates
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        bookings.forEach(b => years.add(new Date(b.bookingDate).getFullYear()));
        billing.forEach(b => years.add(new Date(b.createdAt).getFullYear()));
        return Array.from(years).sort((a, b) => b - a);
    }, [bookings, billing]);

    // Derive available brands from bookings
    const availableBrands = useMemo(() => {
        const brands = new Set<string>();
        bookings.forEach(b => { if (b.bikeBrand) brands.add(b.bikeBrand); });
        return Array.from(brands).sort();
    }, [bookings]);

    const hasActiveFilters = selectedMonth !== 0 || selectedYear !== 'all' || selectedVehicleType !== 'all' || selectedBrand !== 'all' || selectedPaymentStatus !== 'all';

    const clearFilters = () => {
        setSelectedMonth(0);
        setSelectedYear('all');
        setSelectedVehicleType('all');
        setSelectedBrand('all');
        setSelectedPaymentStatus('all');
    };

    // Helper: check if a date matches month/year filters
    const matchesDate = (dateStr: string) => {
        const d = new Date(dateStr);
        if (selectedYear !== 'all' && d.getFullYear() !== Number(selectedYear)) return false;
        if (selectedMonth !== 0 && d.getMonth() + 1 !== selectedMonth) return false;
        return true;
    };

    // Filtered data
    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            if (!matchesDate(b.bookingDate)) return false;
            if (selectedVehicleType !== 'all' && b.vehicleType !== selectedVehicleType) return false;
            if (selectedBrand !== 'all' && b.bikeBrand !== selectedBrand) return false;
            return true;
        });
    }, [bookings, selectedMonth, selectedYear, selectedVehicleType, selectedBrand]);

    const filteredBilling = useMemo(() => {
        return billing.filter(b => {
            if (!matchesDate(b.createdAt)) return false;
            if (selectedPaymentStatus !== 'all' && b.paymentStatus !== selectedPaymentStatus) return false;
            return true;
        });
    }, [billing, selectedMonth, selectedYear, selectedPaymentStatus]);

    const stats = useMemo(() => {
        const totalRevenue = filteredBilling
            .filter(b => b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + b.totalAmount, 0);

        const pendingRevenue = filteredBilling
            .filter(b => b.paymentStatus === 'pending')
            .reduce((sum, b) => sum + b.totalAmount, 0);

        const pendingBookings = filteredBookings.filter(b => b.status === 'pending').length;
        const inProgressBookings = filteredBookings.filter(b => b.status === 'in-progress').length;
        const completedBookings = filteredBookings.filter(b => b.status === 'completed').length;
        const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled').length;

        const unpaidBills = filteredBilling.filter(b => b.paymentStatus === 'pending');

        const recentBookings = [...filteredBookings]
            .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
            .slice(0, 5);

        const recentBills = [...filteredBilling]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);

        return {
            totalRevenue,
            pendingRevenue,
            pendingBookings,
            inProgressBookings,
            completedBookings,
            cancelledBookings,
            unpaidBills,
            recentBookings,
            recentBills,
        };
    }, [filteredBookings, filteredBilling]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            </div>
        );
    }

    const statCards = [
        { name: 'Total Bookings', value: filteredBookings.length, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/bookings' },
        { name: 'Revenue Collected', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/admin/billing' },
        { name: 'Pending Bookings', value: stats.pendingBookings, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', href: '/admin/bookings' },
        { name: 'Active Services', value: services.length, icon: Wrench, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/services' },
    ];

    const quickActions = [
        { name: 'New Booking', href: '/admin/bookings', icon: ClipboardList, color: 'bg-blue-600 hover:bg-blue-700' },
        { name: 'New Estimate', href: '/admin/billing', icon: Receipt, color: 'bg-emerald-600 hover:bg-emerald-700' },
        { name: 'Add Service', href: '/admin/services', icon: Wrench, color: 'bg-purple-600 hover:bg-purple-700' },
        { name: 'Add Bike Brand', href: '/admin/bikes', icon: Bike, color: 'bg-orange-600 hover:bg-orange-700' },
    ];

    const bookingStatusPipeline = [
        { label: 'Pending', count: stats.pendingBookings, color: 'bg-amber-500', icon: Clock },
        { label: 'In Progress', count: stats.inProgressBookings, color: 'bg-violet-500', icon: PlayCircle },
        { label: 'Completed', count: stats.completedBookings, color: 'bg-emerald-500', icon: CheckCircle },
        { label: 'Cancelled', count: stats.cancelledBookings, color: 'bg-red-500', icon: XCircle },
    ];

    const statusConfig: Record<string, { bg: string; text: string }> = {
        pending: { bg: 'bg-amber-100', text: 'text-amber-700' },
        confirmed: { bg: 'bg-blue-100', text: 'text-blue-700' },
        'in-progress': { bg: 'bg-violet-100', text: 'text-violet-700' },
        completed: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
    };

    const selectClass = 'bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black mb-1">Dashboard</h2>
                    <p className="text-zinc-400">Business overview at a glance.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="p-5 rounded-2xl bg-white border border-zinc-200">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-bold text-zinc-700">Filters</h3>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="ml-auto flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
                        >
                            <X className="w-3 h-3" />
                            Clear all
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-3">
                    {/* Month */}
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className={selectClass}
                    >
                        {MONTHS.map((m, i) => (
                            <option key={m} value={i}>{m}</option>
                        ))}
                    </select>

                    {/* Year */}
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className={selectClass}
                    >
                        <option value="all">All Years</option>
                        {availableYears.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>

                    {/* Vehicle Type */}
                    <select
                        value={selectedVehicleType}
                        onChange={(e) => setSelectedVehicleType(e.target.value)}
                        className={selectClass}
                    >
                        <option value="all">All Vehicles</option>
                        <option value="bike">Bike</option>
                        <option value="scooter">Scooter</option>
                    </select>

                    {/* Brand */}
                    <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className={selectClass}
                    >
                        <option value="all">All Brands</option>
                        {availableBrands.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>

                    {/* Payment Status */}
                    <select
                        value={selectedPaymentStatus}
                        onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                        className={selectClass}
                    >
                        <option value="all">All Payments</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.name}
                            href={stat.href}
                            className="group p-6 rounded-2xl bg-white border border-zinc-200 hover:shadow-lg hover:border-zinc-300 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-1 transition-all" />
                            </div>
                            <p className="text-sm text-zinc-500 font-medium mb-1">{stat.name}</p>
                            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.name}
                            href={action.href}
                            className={`${action.color} text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm`}
                        >
                            <Plus className="w-4 h-4" />
                            {action.name}
                        </Link>
                    );
                })}
            </div>

            {/* Booking Pipeline + Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Booking Status Pipeline */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-zinc-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-zinc-900">Booking Pipeline</h3>
                        <Link href="/admin/bookings" className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {bookingStatusPipeline.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.label} className="text-center p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                                    <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-2xl font-black text-zinc-900">{item.count}</p>
                                    <p className="text-xs font-medium text-zinc-500 mt-1">{item.label}</p>
                                </div>
                            );
                        })}
                    </div>
                    {/* Pipeline bar */}
                    {filteredBookings.length > 0 && (
                        <div className="mt-5 flex rounded-full overflow-hidden h-3 bg-zinc-100">
                            {bookingStatusPipeline.map((item) => {
                                const pct = (item.count / filteredBookings.length) * 100;
                                if (pct === 0) return null;
                                return (
                                    <div
                                        key={item.label}
                                        className={`${item.color} transition-all`}
                                        style={{ width: `${pct}%` }}
                                        title={`${item.label}: ${item.count}`}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Revenue Summary */}
                <div className="p-6 rounded-2xl bg-white border border-zinc-200">
                    <h3 className="text-lg font-bold text-zinc-900 mb-6">Revenue</h3>
                    <div className="space-y-5">
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                <p className="text-xs font-bold text-emerald-600">Collected</p>
                            </div>
                            <p className="text-2xl font-black text-emerald-700">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-amber-600" />
                                <p className="text-xs font-bold text-amber-600">Pending</p>
                            </div>
                            <p className="text-2xl font-black text-amber-700">₹{stats.pendingRevenue.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                            <div className="flex items-center gap-2 mb-1">
                                <Receipt className="w-4 h-4 text-zinc-500" />
                                <p className="text-xs font-bold text-zinc-500">Total Estimates</p>
                            </div>
                            <p className="text-2xl font-black text-zinc-900">{filteredBilling.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Bookings + Unpaid Bills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div className="p-6 rounded-2xl bg-white border border-zinc-200">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-zinc-900">Recent Bookings</h3>
                        <Link href="/admin/bookings" className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1">
                            Manage <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {stats.recentBookings.length === 0 ? (
                        <div className="py-10 text-center">
                            <Calendar className="w-10 h-10 text-zinc-200 mx-auto mb-2" />
                            <p className="text-sm text-zinc-400">No bookings found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentBookings.map((booking) => {
                                const sc = statusConfig[booking.status] || statusConfig.pending;
                                return (
                                    <div key={booking._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-zinc-900 truncate">{booking.customerName}</p>
                                            <p className="text-xs text-zinc-500 truncate">
                                                {booking.bikeBrand} {booking.bikeModel}
                                                {booking.vehicleNumber && ` • ${booking.vehicleNumber}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <a href={`tel:${booking.phoneNumber}`} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors" title="Call customer">
                                                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                                            </a>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${sc.bg} ${sc.text}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Unpaid Bills */}
                <div className="p-6 rounded-2xl bg-white border border-zinc-200">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            Unpaid Estimates
                            {stats.unpaidBills.length > 0 && (
                                <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-0.5 rounded-full">
                                    {stats.unpaidBills.length}
                                </span>
                            )}
                        </h3>
                        <Link href="/admin/billing" className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1">
                            Manage <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {stats.unpaidBills.length === 0 ? (
                        <div className="py-10 text-center">
                            <CheckCircle className="w-10 h-10 text-emerald-200 mx-auto mb-2" />
                            <p className="text-sm text-zinc-400">All estimates are paid</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {stats.unpaidBills.slice(0, 5).map((bill) => (
                                <div key={bill._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-zinc-900 truncate">
                                            {bill.customerName || bill.invoiceNumber}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {bill.vehicleNumber || bill.invoiceNumber}
                                            {' • '}
                                            {new Date(bill.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="text-sm font-black text-red-600 shrink-0">₹{bill.totalAmount.toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Inventory Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Link href="/admin/services" className="group p-5 rounded-2xl bg-white border border-zinc-200 hover:shadow-md transition-all flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <Wrench className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900">{services.length}</p>
                        <p className="text-xs font-medium text-zinc-500">Services Listed</p>
                    </div>
                </Link>
                <Link href="/admin/pricing" className="group p-5 rounded-2xl bg-white border border-zinc-200 hover:shadow-md transition-all flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                        <Tag className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900">{pricing.length}</p>
                        <p className="text-xs font-medium text-zinc-500">Pricing Packages</p>
                    </div>
                </Link>
                <Link href="/admin/bikes" className="group p-5 rounded-2xl bg-white border border-zinc-200 hover:shadow-md transition-all flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                        <Bike className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900">{bikes.length}</p>
                        <p className="text-xs font-medium text-zinc-500">Bike Brands</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
