'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, Download, Clock, Users, IndianRupee, Search, Upload, FileSpreadsheet, Link2, X, CheckCircle, AlertCircle } from 'lucide-react';

interface AlertCustomer {
    _id: string;
    customerName: string;
    phoneNumber: string;
    email?: string;
    lastBookingDate: string;
    lastBikeBrand: string;
    lastBikeModel: string;
    vehicleNumber?: string;
    totalBookings: number;
    totalSpent: number;
}

interface UploadResult {
    success: boolean;
    inserted: number;
    skipped: number;
    skippedDetails: { row: number; reason: string }[];
    total: number;
    updated?: number;
    error?: string;
}

const intervals = [
    { label: '2 Months', months: 2 },
    { label: '4 Months', months: 4 },
    { label: '6 Months', months: 6 },
];

export default function AlertManagerPage() {
    const [customers, setCustomers] = useState<AlertCustomer[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedInterval, setSelectedInterval] = useState(2);
    const [search, setSearch] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
    const [sheetUrl, setSheetUrl] = useState('');
    const [uploadTab, setUploadTab] = useState<'file' | 'gsheet'>('file');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchCustomers = async (months: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/alerts?months=${months}`);
            const data = await res.json();
            setCustomers(data);
        } catch (err) {
            console.error('Failed to fetch alert customers', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers(selectedInterval);
    }, [selectedInterval]);

    const filtered = customers.filter(c =>
        c.customerName.toLowerCase().includes(search.toLowerCase()) ||
        c.phoneNumber.includes(search)
    );

    const downloadCSV = () => {
        const headers = ['Customer Name', 'Phone Number', 'Email', 'Last Booking Date', 'Last Vehicle', 'Vehicle Number', 'Total Bookings', 'Total Spent'];
        const rows = filtered.map(c => [
            c.customerName,
            c.phoneNumber,
            c.email || '',
            new Date(c.lastBookingDate).toLocaleDateString('en-IN'),
            `${c.lastBikeBrand} ${c.lastBikeModel}`,
            c.vehicleNumber || '',
            c.totalBookings,
            c.totalSpent,
        ]);

        const csv = [headers, ...rows].map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `follow-up-customers-${selectedInterval}months-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        setUploadResult(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/alerts/upload', { method: 'POST', body: formData });
            const data = await res.json();
            setUploadResult(data);
            if (data.success) fetchCustomers(selectedInterval);
        } catch (err) {
            console.error('Upload failed', err);
            setUploadResult({ success: false, inserted: 0, skipped: 0, skippedDetails: [], total: 0 });
        } finally {
            setUploading(false);
        }
    };

    const handleGoogleSheetImport = async () => {
        if (!sheetUrl.trim()) return;
        setUploading(true);
        setUploadResult(null);
        try {
            const res = await fetch('/api/alerts/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sheetUrl: sheetUrl.trim() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setUploadResult({ success: false, inserted: 0, skipped: 0, skippedDetails: [], total: 0, error: data.error });
            } else {
                setUploadResult(data);
                if (data.success) fetchCustomers(selectedInterval);
            }
        } catch (err) {
            console.error('Google Sheet import failed', err);
            setUploadResult({ success: false, inserted: 0, skipped: 0, skippedDetails: [], total: 0 });
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    };

    const daysSince = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900">Alert Manager</h1>
                    <p className="text-sm text-zinc-500 mt-1">Customers who haven&apos;t visited in a while</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setShowUpload(true); setUploadResult(null); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all"
                    >
                        <Upload className="w-4 h-4" />
                        Import
                    </button>
                    <button
                        onClick={downloadCSV}
                        disabled={filtered.length === 0}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                    >
                        <Download className="w-4 h-4" />
                        Download CSV
                    </button>
                </div>
            </div>

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowUpload(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black text-zinc-900">Import Customers</h2>
                            <button onClick={() => setShowUpload(false)} className="p-1.5 hover:bg-zinc-100 rounded-lg">
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-zinc-100 rounded-xl p-1">
                            <button
                                onClick={() => setUploadTab('file')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                                    uploadTab === 'file' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
                                }`}
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Excel File
                            </button>
                            <button
                                onClick={() => setUploadTab('gsheet')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                                    uploadTab === 'gsheet' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
                                }`}
                            >
                                <Link2 className="w-4 h-4" />
                                Google Sheet
                            </button>
                        </div>

                        {uploadTab === 'file' ? (
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                                    dragOver ? 'border-red-600 bg-red-50' : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                                }`}
                            >
                                <FileSpreadsheet className="w-10 h-10 mx-auto mb-3 text-zinc-300" />
                                <p className="font-bold text-sm text-zinc-700">Drop your Excel file here</p>
                                <p className="text-xs text-zinc-400 mt-1">or click to browse (.xlsx, .xls, .csv)</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase mb-1.5 block">Google Sheet URL</label>
                                    <input
                                        type="text"
                                        value={sheetUrl}
                                        onChange={(e) => setSheetUrl(e.target.value)}
                                        placeholder="https://docs.google.com/spreadsheets/d/..."
                                        className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                                    />
                                </div>
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                    <p className="text-xs text-amber-700 font-medium">
                                        Make sure your sheet is shared as <strong>&quot;Anyone with the link can view&quot;</strong>
                                    </p>
                                </div>
                                <button
                                    onClick={handleGoogleSheetImport}
                                    disabled={!sheetUrl.trim() || uploading}
                                    className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50"
                                >
                                    {uploading ? 'Importing...' : 'Import from Google Sheet'}
                                </button>
                            </div>
                        )}

                        {/* Upload Progress / Result */}
                        {uploading && (
                            <div className="flex items-center justify-center py-4">
                                <div className="w-6 h-6 border-3 border-red-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                                <span className="text-sm text-zinc-500 font-medium">Processing...</span>
                            </div>
                        )}

                        {uploadResult && (
                            <div className={`rounded-xl p-4 ${uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <div className="flex items-start gap-3">
                                    {uploadResult.success ? (
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                    )}
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900">
                                            {uploadResult.success ? 'Import complete' : 'Import failed'}
                                        </p>
                                        {uploadResult.success ? (
                                            <div className="text-xs text-zinc-600 mt-1 space-y-0.5">
                                                <p>{uploadResult.inserted} new customers imported</p>
                                                {(uploadResult.updated || 0) > 0 && (
                                                    <p>{uploadResult.updated} existing customers updated</p>
                                                )}
                                                {uploadResult.skipped > 0 && (
                                                    <p className="text-amber-600">{uploadResult.skipped} rows skipped (missing name/phone)</p>
                                                )}
                                            </div>
                                        ) : uploadResult.error && (
                                            <p className="text-xs text-red-600 mt-1">{uploadResult.error}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Expected columns */}
                        <div className="text-xs text-zinc-400">
                            <p className="font-bold mb-1">Expected columns:</p>
                            <p>Timestamp, Name, Address, Mobile, Email, Vehicle Registration Number, Vehicle</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Interval Tabs */}
            <div className="flex gap-2">
                {intervals.map(({ label, months }) => (
                    <button
                        key={months}
                        onClick={() => setSelectedInterval(months)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            selectedInterval === months
                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-700'
                        }`}
                    >
                        {label}+ ago
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl border border-zinc-200 p-4">
                    <div className="flex items-center gap-2 text-zinc-400 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Customers</span>
                    </div>
                    <p className="text-2xl font-black text-zinc-900">{filtered.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-zinc-200 p-4">
                    <div className="flex items-center gap-2 text-zinc-400 mb-1">
                        <Phone className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">To Call</span>
                    </div>
                    <p className="text-2xl font-black text-zinc-900">{filtered.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-zinc-200 p-4 col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2 text-zinc-400 mb-1">
                        <IndianRupee className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Total Revenue</span>
                    </div>
                    <p className="text-2xl font-black text-zinc-900">
                        {filtered.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString('en-IN')}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                />
            </div>

            {/* Customer List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-zinc-400">
                    <Phone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-bold">No customers found</p>
                    <p className="text-sm mt-1">All customers have visited within {selectedInterval} months</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-100">
                                    <th className="text-left px-5 py-3 text-xs font-bold text-zinc-400 uppercase">Customer</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold text-zinc-400 uppercase">Phone</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold text-zinc-400 uppercase">Last Visit</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold text-zinc-400 uppercase">Vehicle</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold text-zinc-400 uppercase">Bookings</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold text-zinc-400 uppercase">Spent</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold text-zinc-400 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((customer) => (
                                    <tr key={customer._id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-5 py-3">
                                            <p className="font-bold text-sm text-zinc-900">{customer.customerName}</p>
                                            {customer.email && <p className="text-xs text-zinc-400">{customer.email}</p>}
                                        </td>
                                        <td className="px-5 py-3 text-sm text-zinc-700 font-medium">{customer.phoneNumber}</td>
                                        <td className="px-5 py-3">
                                            <p className="text-sm text-zinc-700">{new Date(customer.lastBookingDate).toLocaleDateString('en-IN')}</p>
                                            <p className="text-xs text-red-500 font-bold">{daysSince(customer.lastBookingDate)} days ago</p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <p className="text-sm text-zinc-700">{customer.lastBikeBrand} {customer.lastBikeModel}</p>
                                            {customer.vehicleNumber && <p className="text-xs text-zinc-400">{customer.vehicleNumber}</p>}
                                        </td>
                                        <td className="px-5 py-3 text-sm font-bold text-zinc-700">{customer.totalBookings}</td>
                                        <td className="px-5 py-3 text-sm font-bold text-zinc-700">{customer.totalSpent.toLocaleString('en-IN')}</td>
                                        <td className="px-5 py-3">
                                            <a
                                                href={`tel:${customer.phoneNumber}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-all"
                                            >
                                                <Phone className="w-3.5 h-3.5" />
                                                Call
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {filtered.map((customer) => (
                            <div key={customer._id} className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-bold text-zinc-900">{customer.customerName}</p>
                                        <p className="text-sm text-zinc-500">{customer.phoneNumber}</p>
                                    </div>
                                    <a
                                        href={`tel:${customer.phoneNumber}`}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-all"
                                    >
                                        <Phone className="w-3.5 h-3.5" />
                                        Call
                                    </a>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-red-500 font-bold">{daysSince(customer.lastBookingDate)}d ago</span>
                                    </div>
                                    <span>{customer.lastBikeBrand} {customer.lastBikeModel}</span>
                                    <span>{customer.totalBookings} bookings</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-400">Last: {new Date(customer.lastBookingDate).toLocaleDateString('en-IN')}</span>
                                    <span className="font-bold text-zinc-700">{customer.totalSpent.toLocaleString('en-IN')} spent</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
