import connectDB from '@/lib/mongodb';
import Billing from '@/models/Billing';
import { siteConfig } from '@/lib/config/site';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getBill(id: string) {
    await connectDB();
    try {
        const bill = await Billing.findById(id).lean();
        if (!bill) return null;
        return JSON.parse(JSON.stringify(bill));
    } catch {
        return null;
    }
}

export default async function EBillPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const bill = await getBill(id);

    if (!bill) notFound();

    const subtotal = bill.items?.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0) || 0;

    return (
        <div className="min-h-screen bg-zinc-50 py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-zinc-900 px-8 py-8 sm:px-12">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center font-black text-white text-lg">RR</div>
                            <div>
                                <h1 className="text-2xl font-black text-white">ROAD<span className="text-red-500">ROMEO</span></h1>
                                <p className="text-zinc-400 text-xs font-medium">Professional Bike Service & Repairs</p>
                            </div>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Estimate</p>
                            <p className="text-white font-bold text-lg">{bill.invoiceNumber}</p>
                            <p className="text-zinc-400 text-sm">{new Date(bill.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-8 sm:px-12 space-y-8">
                    {/* Bill To & Vehicle */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-[11px] font-black uppercase text-zinc-400 tracking-widest mb-3">Bill To</h4>
                            {bill.customerName ? (
                                <div className="space-y-1.5">
                                    <p className="font-bold text-zinc-900">{bill.customerName}</p>
                                    {bill.phoneNumber && <p className="text-sm text-zinc-500">+91 {bill.phoneNumber}</p>}
                                    {bill.address && <p className="text-sm text-zinc-500 leading-relaxed">{bill.address}</p>}
                                </div>
                            ) : (
                                <p className="text-zinc-400 italic text-sm">Direct Customer</p>
                            )}
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black uppercase text-zinc-400 tracking-widest mb-3">Vehicle</h4>
                            {bill.vehicleNumber ? (
                                <span className="inline-block px-3 py-1.5 bg-zinc-100 rounded-lg text-sm font-black border border-zinc-200 uppercase">
                                    {bill.vehicleNumber}
                                </span>
                            ) : (
                                <p className="text-zinc-400 italic text-sm">N/A</p>
                            )}
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="border border-zinc-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    <th className="px-5 py-3 sm:px-6">Description</th>
                                    <th className="px-5 py-3 sm:px-6 text-center">Qty</th>
                                    <th className="px-5 py-3 sm:px-6 text-right">Price</th>
                                    <th className="px-5 py-3 sm:px-6 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {bill.items?.map((item: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="px-5 py-4 sm:px-6 font-semibold text-zinc-900 text-sm">{item.description}</td>
                                        <td className="px-5 py-4 sm:px-6 text-center text-zinc-500 text-sm">{item.quantity}</td>
                                        <td className="px-5 py-4 sm:px-6 text-right text-zinc-500 text-sm">&#8377;{item.price}</td>
                                        <td className="px-5 py-4 sm:px-6 text-right font-bold text-zinc-900 text-sm">&#8377;{item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Subtotal</span>
                                <span className="font-semibold text-zinc-900">&#8377;{subtotal}</span>
                            </div>
                            {(bill.discount > 0) && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Discount</span>
                                    <span className="font-semibold text-red-600">-&#8377;{bill.discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t-2 border-zinc-900">
                                <span className="text-lg font-black text-zinc-900">Grand Total</span>
                                <span className="text-2xl font-black text-red-600">&#8377;{bill.totalAmount}</span>
                            </div>
                            <div className="pt-4">
                                <div className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase text-center tracking-widest ${bill.paymentStatus === 'paid'
                                        ? 'bg-emerald-600 text-white'
                                        : bill.paymentStatus === 'pending'
                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                            : 'bg-red-50 text-red-600 border border-red-200'
                                    }`}>
                                    Payment: {bill.paymentStatus}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 border-t border-zinc-100 text-center space-y-2">
                        <p className="text-base font-bold text-zinc-800">Thank you for choosing Road Romeo!</p>
                        <p className="text-xs text-zinc-400">Support: +91 {siteConfig.contact.phone}</p>
                        <p className="text-[10px] text-zinc-300 italic">This is a computer generated estimate and does not require a signature.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
