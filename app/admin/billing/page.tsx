'use client';

import { useData } from '@/components/providers/DataProvider';
import { Loader2, Receipt, Search, Plus, Filter, Download } from 'lucide-react';

export default function BillingManagement() {
    const { billing, loading } = useData();

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-zinc-900">Billing</h2>
                    <p className="text-zinc-500">Manage invoices and track payments.</p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-600/20">
                    <Plus className="w-5 h-5" />
                    Create Invoice
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search by invoice # or customer..."
                            className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-600 hover:bg-zinc-100 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100">
                                <th className="px-8 py-4">Invoice #</th>
                                <th className="px-8 py-4">Booking ID</th>
                                <th className="px-8 py-4">Total Amount</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {billing.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-zinc-500">
                                        <div className="max-w-xs mx-auto">
                                            <Receipt className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                                            <p className="font-medium text-zinc-900 mb-1">No invoices yet</p>
                                            <p className="text-sm">Create your first invoice to start tracking payments.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                billing.map((bill) => (
                                    <tr key={bill._id} className="hover:bg-zinc-50 transition-colors group">
                                        <td className="px-8 py-6 font-bold text-zinc-900">{bill.invoiceNumber}</td>
                                        <td className="px-8 py-6 text-zinc-500 text-sm font-mono">
                                            {typeof bill.bookingId === 'string' ? bill.bookingId : (bill.bookingId?._id || 'N/A')}
                                        </td>
                                        <td className="px-8 py-6 font-black text-red-600">₹{bill.totalAmount}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' :
                                                    bill.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-600' :
                                                        'bg-red-100 text-red-600'
                                                }`}>
                                                {bill.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
