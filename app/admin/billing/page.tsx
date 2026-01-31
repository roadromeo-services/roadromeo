'use client';

import { useState } from 'react';
import { useData } from '@/components/providers/DataProvider';
import {
    Loader2, Receipt, Search, Plus, Filter, Download,
    Trash2, Edit2, CheckCircle, XCircle, ChevronDown,
    PlusCircle, MinusCircle, Save, X
} from 'lucide-react';

export default function BillingManagement() {
    const { billing, updateBilling, deleteBilling, createBilling, loading } = useData();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleSave = async () => {
        try {
            if (editingId) {
                await updateBilling(editingId, editData);
            } else {
                await createBilling(editData);
            }
            setEditingId(null);
            setIsAdding(false);
            setEditData(null);
        } catch (err) {
            alert('Failed to save invoice');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this invoice?')) return;
        try {
            await deleteBilling(id);
        } catch (err) {
            alert('Failed to delete invoice');
        }
    };

    const addItem = () => {
        setEditData({
            ...editData,
            items: [...editData.items, { description: '', quantity: 1, price: 0 }]
        });
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...editData.items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Calculate total
        const subtotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const total = subtotal + (editData.tax || 0) - (editData.discount || 0);

        setEditData({ ...editData, items: newItems, totalAmount: total });
    };

    const removeItem = (index: number) => {
        const newItems = editData.items.filter((_: any, i: number) => i !== index);
        const subtotal = newItems.reduce((acc, item: any) => acc + (item.price * item.quantity), 0);
        const total = subtotal + (editData.tax || 0) - (editData.discount || 0);
        setEditData({ ...editData, items: newItems, totalAmount: total });
    };

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
                    <p className="text-zinc-500">Track payments, parts, and labor costs.</p>
                </div>
                {!isAdding && !editingId && (
                    <button
                        onClick={() => {
                            setIsAdding(true);
                            setEditData({
                                invoiceNumber: `INV-${Date.now()}`,
                                items: [{ description: '', quantity: 1, price: 0 }],
                                tax: 0,
                                discount: 0,
                                totalAmount: 0,
                                paymentStatus: 'pending'
                            });
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-600/20"
                    >
                        <Plus className="w-5 h-5" />
                        New Invoice
                    </button>
                )}
            </div>

            {(isAdding || editingId) && (
                <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-xl animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-zinc-900">Invoice: {editData.invoiceNumber}</h3>
                        <div className="flex items-center gap-3">
                            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all">
                                <Save className="w-4 h-4" /> Save
                            </button>
                            <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-xl">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-zinc-400">Payment Status</label>
                                <select
                                    value={editData.paymentStatus}
                                    onChange={(e) => setEditData({ ...editData, paymentStatus: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-zinc-400">Payment Method</label>
                                <input
                                    value={editData.paymentMethod || ''}
                                    onChange={(e) => setEditData({ ...editData, paymentMethod: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                                    placeholder="Cash, UPI, Card..."
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase text-zinc-400">Line Items (Parts & Labor)</label>
                                <button onClick={addItem} className="text-xs font-bold text-red-600 flex items-center gap-1 hover:underline">
                                    <PlusCircle className="w-4 h-4" /> Add Item
                                </button>
                            </div>

                            {editData.items.map((item: any, idx: number) => (
                                <div key={idx} className="grid grid-cols-12 gap-4 items-end bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                                    <div className="col-span-6 space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-400">Description</label>
                                        <input
                                            value={item.description}
                                            onChange={(e) => updateItem(idx, 'description', e.target.value)}
                                            className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-red-600"
                                            placeholder="Engine Oil, Brake Pads, etc."
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-400">Qty</label>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                                            className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-red-600"
                                        />
                                    </div>
                                    <div className="col-span-3 space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-400">Price (₹)</label>
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => updateItem(idx, 'price', Number(e.target.value))}
                                            className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-red-600"
                                        />
                                    </div>
                                    <div className="col-span-1 pb-1">
                                        <button onClick={() => removeItem(idx)} className="p-2 text-zinc-300 hover:text-red-600 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-6 border-t border-zinc-100">
                            <div className="w-full max-w-xs space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Tax (₹)</span>
                                    <input
                                        type="number"
                                        value={editData.tax || 0}
                                        onChange={(e) => {
                                            const tax = Number(e.target.value);
                                            const subtotal = editData.items.reduce((acc: any, item: any) => acc + (item.price * item.quantity), 0);
                                            setEditData({ ...editData, tax, totalAmount: subtotal + tax - (editData.discount || 0) });
                                        }}
                                        className="w-24 text-right bg-zinc-50 border-none outline-none font-bold"
                                    />
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Discount (₹)</span>
                                    <input
                                        type="number"
                                        value={editData.discount || 0}
                                        onChange={(e) => {
                                            const discount = Number(e.target.value);
                                            const subtotal = editData.items.reduce((acc: any, item: any) => acc + (item.price * item.quantity), 0);
                                            setEditData({ ...editData, discount, totalAmount: subtotal + (editData.tax || 0) - discount });
                                        }}
                                        className="w-24 text-right bg-zinc-50 border-none outline-none font-bold text-red-600"
                                    />
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
                                    <span className="text-lg font-black text-zinc-900">Total Amount</span>
                                    <span className="text-2xl font-black text-red-600">₹{editData.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!isAdding && !editingId && (
                <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-100 flex items-center justify-between gap-4 flex-wrap">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100">
                                    <th className="px-8 py-4">Invoice #</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Total Amount</th>
                                    <th className="px-8 py-4">Date</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {billing.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-zinc-500">
                                            <Receipt className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                                            <p className="font-medium text-zinc-900">No invoices yet</p>
                                        </td>
                                    </tr>
                                ) : (
                                    billing.map((bill) => (
                                        <tr key={bill._id} className="hover:bg-zinc-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <p className="font-bold text-zinc-900">{bill.invoiceNumber}</p>
                                                <p className="text-[10px] text-zinc-400 font-mono">{bill._id}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' :
                                                        bill.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-600' :
                                                            'bg-red-100 text-red-600'
                                                    }`}>
                                                    {bill.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-black text-red-600">₹{bill.totalAmount}</td>
                                            <td className="px-8 py-6 text-zinc-500 text-sm">
                                                {new Date(bill.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => { setEditingId(bill._id); setEditData(bill); }}
                                                        className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(bill._id)}
                                                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
