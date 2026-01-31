'use client';

import { useState } from 'react';
import { useData } from '@/components/providers/DataProvider';
import {
    Loader2, Receipt, Search, Plus, Filter, Download,
    Trash2, Edit2, CheckCircle, XCircle, ChevronDown,
    PlusCircle, MinusCircle, Save, X, Printer, User, Bike, MapPin, Phone
} from 'lucide-react';

export default function BillingManagement() {
    const { billing, updateBilling, deleteBilling, createBilling, loading } = useData();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [printingInvoice, setPrintingInvoice] = useState<any>(null);

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
        const subtotal = newItems.reduce((acc: number, item) => acc + (item.price * item.quantity), 0);
        const total = subtotal + (editData.tax || 0) - (editData.discount || 0);

        setEditData({ ...editData, items: newItems, totalAmount: total });
    };

    const removeItem = (index: number) => {
        const newItems = editData.items.filter((_: any, i: number) => i !== index);
        const subtotal = newItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        const total = subtotal + (editData.tax || 0) - (editData.discount || 0);
        setEditData({ ...editData, items: newItems, totalAmount: total });
    };

    const handleDownloadPDF = () => {
        if (!printingInvoice) return;

        const inv = printingInvoice;
        const booking = inv.bookingId;
        const subtotal = inv.items.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0);

        const itemRows = inv.items.map((item: any) => `
            <tr>
                <td style="padding:12px 16px;font-weight:600;color:#111;">${item.description}</td>
                <td style="padding:12px 16px;text-align:center;color:#666;">${item.quantity}</td>
                <td style="padding:12px 16px;text-align:right;color:#666;">&#8377;${item.price}</td>
                <td style="padding:12px 16px;text-align:right;font-weight:700;color:#111;">&#8377;${item.price * item.quantity}</td>
            </tr>
        `).join('');

        const statusColor = inv.paymentStatus === 'paid' ? '#16a34a' : '#dc2626';
        const statusBg = inv.paymentStatus === 'paid' ? '#dcfce7' : '#fef2f2';

        const html = `
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Invoice ${inv.invoiceNumber}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
            <style>
                * { margin:0; padding:0; box-sizing:border-box; }
                body { font-family: 'Geist', Arial, Helvetica, sans-serif; color:#111; background:#fff; padding:40px; }
                .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; }
                .logo-box { width:48px; height:48px; background:#dc2626; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; color:#fff; font-weight:900; font-size:18px; margin-right:10px; vertical-align:middle; }
                .brand { font-size:28px; font-weight:900; display:inline; vertical-align:middle; }
                .brand span { color:#dc2626; }
                .tagline { color:#888; font-size:13px; margin-top:6px; }
                .contact { color:#aaa; font-size:12px; margin-top:8px; line-height:1.6; }
                .invoice-label { font-size:42px; font-weight:900; color:#e5e5e5; text-transform:uppercase; }
                .invoice-meta { text-align:right; margin-top:8px; }
                .invoice-meta p { font-size:13px; color:#666; }
                .invoice-meta .num { font-weight:700; color:#111; font-size:14px; }
                .divider { border:none; border-top:1px solid #eee; margin:30px 0; }
                .info-grid { display:flex; gap:60px; margin-bottom:30px; }
                .info-section { flex:1; }
                .info-label { font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#aaa; margin-bottom:12px; }
                .info-value { font-size:14px; color:#111; font-weight:600; margin-bottom:4px; }
                .info-sub { font-size:13px; color:#666; margin-bottom:4px; }
                .plate { display:inline-block; background:#f4f4f5; border:1px solid #e4e4e7; border-radius:6px; padding:4px 12px; font-size:12px; font-weight:900; text-transform:uppercase; margin-top:4px; }
                table { width:100%; border-collapse:collapse; margin:20px 0; }
                thead tr { background:#fafafa; }
                thead th { padding:10px 16px; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:1.5px; color:#aaa; border-bottom:1px solid #e5e5e5; text-align:left; }
                thead th.r { text-align:right; }
                thead th.c { text-align:center; }
                tbody tr { border-bottom:1px solid #f4f4f5; }
                .totals { display:flex; justify-content:flex-end; margin-top:20px; }
                .totals-box { width:260px; }
                .total-row { display:flex; justify-content:space-between; padding:8px 0; font-size:13px; }
                .total-row .label { color:#888; }
                .total-row .value { color:#111; font-weight:500; }
                .total-row.discount .value { color:#dc2626; }
                .grand-total { display:flex; justify-content:space-between; padding:14px 0; border-top:2px solid #555; margin-top:8px; }
                .grand-total .label { font-size:16px; font-weight:900; color:#111; }
                .grand-total .value { font-size:22px; font-weight:900; color:#dc2626; }
                .status-badge { display:inline-block; padding:6px 20px; border-radius:10px; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:2px; margin-top:16px; }
                .footer { text-align:center; margin-top:60px; padding-top:20px; }
                .footer p { font-size:14px; font-weight:600; }
                .footer .note { font-size:11px; color:#aaa; font-style:italic; margin-top:8px; }
                @media print { body { padding:20px; } }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <div><span class="logo-box">RR</span><span class="brand">ROAD<span>ROMEO</span></span></div>
                    <p class="tagline">Professional Bike Service &amp; Repairs</p>
                    <div class="contact">
                        <p>Pune, Maharashtra, India</p>
                        <p>Support: +91 93596 66964</p>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div class="invoice-label">Invoice</div>
                    <div class="invoice-meta">
                        <p class="num">${inv.invoiceNumber}</p>
                        <p>${new Date(inv.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <hr class="divider" />

            <div class="info-grid">
                <div class="info-section">
                    <div class="info-label">Bill To:</div>
                    ${booking ? `
                        <p class="info-value">${booking.customerName}</p>
                        <p class="info-sub">+91 ${booking.phoneNumber}</p>
                        ${booking.address ? `<p class="info-sub">${booking.address}</p>` : ''}
                    ` : '<p class="info-sub" style="font-style:italic;">Direct Customer</p>'}
                </div>
                <div class="info-section">
                    <div class="info-label">Vehicle Details:</div>
                    ${booking ? `
                        <p class="info-value" style="text-transform:uppercase;">${booking.bikeBrand} ${booking.bikeModel}</p>
                        ${booking.vehicleNumber ? `<span class="plate">${booking.vehicleNumber}</span>` : ''}
                    ` : '<p class="info-sub" style="font-style:italic;">N/A</p>'}
                </div>
            </div>

            <hr class="divider" />

            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="c">Qty</th>
                        <th class="r">Price</th>
                        <th class="r">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemRows}
                </tbody>
            </table>

            <div class="totals">
                <div class="totals-box">
                    <div class="total-row"><span class="label">Subtotal</span><span class="value">&#8377;${subtotal}</span></div>
                    <div class="total-row"><span class="label">Tax</span><span class="value">&#8377;${inv.tax || 0}</span></div>
                    <div class="total-row discount"><span class="label">Discount</span><span class="value">-&#8377;${inv.discount || 0}</span></div>
                    <div class="grand-total"><span class="label">Grand Total</span><span class="value">&#8377;${inv.totalAmount}</span></div>
                    <div style="text-align:center;margin-top:16px;">
                        <span class="status-badge" style="background:${statusBg};color:${statusColor};">Status: ${inv.paymentStatus}</span>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>Thank you for choosing RoadRomeo!</p>
                <p class="note">This is a computer generated invoice and does not require a signature.</p>
            </div>
        </body>
        </html>`;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
        };
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
            <div className="flex items-center justify-between print:hidden">
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

            {/* Print Preview Modal */}
            {printingInvoice && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:bg-white print:p-0 print:static print:inset-auto">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-12 shadow-2xl relative print:shadow-none print:p-0 print:max-h-none print:relative print:w-full print:rounded-none">

                        {/* Close button - hidden on print */}
                        <button
                            onClick={() => setPrintingInvoice(null)}
                            className="absolute top-8 right-8 p-2 hover:bg-zinc-100 rounded-full transition-colors print:hidden"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Download Button - hidden on print */}
                        <button
                            onClick={handleDownloadPDF}
                            className="fixed bottom-12 right-12 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-all flex items-center gap-2 font-bold px-8 animate-bounce print:hidden"
                        >
                            <Download className="w-6 h-6" />
                            Download PDF
                        </button>

                        {/* Invoice Contents */}
                        <div className="space-y-12 bg-white p-8">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center font-black text-white text-xl">RR</div>
                                        <h1 className="text-3xl font-black">ROAD<span className="text-red-600">ROMEO</span></h1>
                                    </div>
                                    <p className="text-zinc-500 font-medium">Professional Bike Service & Repairs</p>
                                    <div className="text-sm text-zinc-400 space-y-1">
                                        <p>Pune, Maharashtra, India</p>
                                        <p>Support: +91 93596 66964</p>
                                    </div>
                                </div>
                                <div className="text-right space-y-2">
                                    <h2 className="text-5xl font-black text-zinc-200 uppercase">Invoice</h2>
                                    <div className="space-y-1">
                                        <p className="font-bold text-zinc-900">{printingInvoice.invoiceNumber}</p>
                                        <p className="text-zinc-500">{new Date(printingInvoice.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Client & Booking Info */}
                            <div className="grid grid-cols-2 gap-12 py-10 border-y border-zinc-100">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase text-zinc-400 tracking-widest">Bill To:</h4>
                                    {printingInvoice.bookingId ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-zinc-900 font-bold">
                                                <User className="w-4 h-4 text-red-600" />
                                                <p>{printingInvoice.bookingId.customerName}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Phone className="w-4 h-4" />
                                                <p>+91 {printingInvoice.bookingId.phoneNumber}</p>
                                            </div>
                                            {printingInvoice.bookingId.address && (
                                                <div className="flex items-start gap-2 text-zinc-500 max-w-sm">
                                                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                                    <p className="text-sm leading-relaxed">{printingInvoice.bookingId.address}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-zinc-500 italic">Direct Customer</p>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase text-zinc-400 tracking-widest">Vehicle Details:</h4>
                                    {printingInvoice.bookingId ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-zinc-900 font-bold uppercase">
                                                <Bike className="w-4 h-4 text-red-600" />
                                                <p>{printingInvoice.bookingId.bikeBrand} {printingInvoice.bookingId.bikeModel}</p>
                                            </div>
                                            {printingInvoice.bookingId.vehicleNumber && (
                                                <div className="px-3 py-1 bg-zinc-100 rounded-lg w-fit text-sm font-black border border-zinc-200 uppercase">
                                                    {printingInvoice.bookingId.vehicleNumber}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-zinc-500 italic">N/A</p>
                                    )}
                                </div>
                            </div>

                            {/* Table */}
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                        <th className="px-6 py-4 border-b border-zinc-200">Description</th>
                                        <th className="px-6 py-4 border-b border-zinc-200 text-center">Qty</th>
                                        <th className="px-6 py-4 border-b border-zinc-200 text-right">Price</th>
                                        <th className="px-6 py-4 border-b border-zinc-200 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {printingInvoice.items.map((item: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-6 font-bold text-zinc-900">{item.description}</td>
                                            <td className="px-6 py-6 text-center text-zinc-500">{item.quantity}</td>
                                            <td className="px-6 py-6 text-right text-zinc-500">₹{item.price}</td>
                                            <td className="px-6 py-6 text-right font-bold text-zinc-900">₹{item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="flex justify-end pt-8">
                                <div className="w-full max-w-xs space-y-4">
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="text-zinc-500">Subtotal</span>
                                        <span className="text-zinc-900">₹{printingInvoice.items.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="text-zinc-500">Tax</span>
                                        <span className="text-zinc-900">₹{printingInvoice.tax || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="text-zinc-500">Discount</span>
                                        <span className="text-red-600">-₹{printingInvoice.discount || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t-2 border-zinc-500">
                                        <span className="text-lg font-black text-zinc-900">Grand Total</span>
                                        <span className="text-2xl font-black text-red-600">₹{printingInvoice.totalAmount}</span>
                                    </div>
                                    <div className="pt-6">
                                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase text-center tracking-widest ${printingInvoice.paymentStatus === 'paid' ? 'bg-green-600 text-white' : 'bg-red-50 text-red-600 border border-red-200'
                                            }`}>
                                            Status: {printingInvoice.paymentStatus}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-20 text-center space-y-4">
                                <p className="text-lg font-bold">Thank you for choosing RoadRomeo!</p>
                                <p className="text-xs text-zinc-400 italic">This is a computer generated invoice and does not require a signature.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(isAdding || editingId) && (
                <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-xl animate-in fade-in slide-in-from-top-4 print:hidden">
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
                                            const subtotal = editData.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
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
                                            const subtotal = editData.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
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
                <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm print:hidden">
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
                                                <p className="text-[10px] text-zinc-400 font-mono">
                                                    {bill.bookingId?.customerName || 'Direct'}
                                                </p>
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
                                                        onClick={() => setPrintingInvoice(bill)}
                                                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-zinc-100 rounded-lg transition-all"
                                                        title="View & Print"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>
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
