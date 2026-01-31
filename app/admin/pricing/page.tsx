'use client';

import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useData } from '@/components/providers/DataProvider';

export default function PricingManagement() {
    const { pricing: packages, loading } = useData();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black">Pricing</h2>
                    <p className="text-zinc-400">Manage service packages and their benefits.</p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all">
                    <Plus className="w-5 h-5" />
                    Add Package
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <div key={pkg._id} className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-xl transition-all relative group">
                            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-zinc-100 hover:bg-blue-600 hover:text-white text-zinc-600 rounded-lg transition-colors">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-zinc-100 hover:bg-red-600 hover:text-white text-zinc-600 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            {pkg.popular && (
                                <span className="inline-block px-3 py-1 rounded-full bg-red-600 text-[10px] font-black uppercase tracking-tighter mb-4 text-white">
                                    {pkg.badge || 'Popular'}
                                </span>
                            )}
                            <h4 className="text-2xl font-black mb-1 text-zinc-900">{pkg.name}</h4>
                            <p className="text-4xl font-black text-red-600 mb-6">₹{pkg.price}</p>
                            <ul className="space-y-3">
                                {pkg.features.map((f: string) => (
                                    <li key={f} className="text-sm text-zinc-500 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
