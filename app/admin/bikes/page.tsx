'use client';

import { Plus, Pencil, Trash2, Loader2, Bike } from 'lucide-react';
import { useData } from '@/components/providers/DataProvider';

export default function BikesManagement() {
    const { bikes: brands, loading } = useData();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black">Bike Brands</h2>
                    <p className="text-zinc-400">Manage supported bike brands and their models.</p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all">
                    <Plus className="w-5 h-5" />
                    Add Brand
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {brands.map((brand) => (
                        <div key={brand._id} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-zinc-800 hover:bg-blue-600 text-white rounded-lg transition-colors">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-zinc-800 hover:bg-red-600 text-white rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-4">
                                <Bike className="w-6 h-6 text-red-600" />
                            </div>
                            <h4 className="text-xl font-bold mb-2">{brand.name}</h4>
                            <p className="text-sm text-zinc-500">{brand.models.length} Models</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {brand.models.slice(0, 3).map((m: string) => (
                                    <span key={m} className="text-[10px] bg-zinc-800 px-2 py-1 rounded-md text-zinc-400">{m}</span>
                                ))}
                                {brand.models.length > 3 && <span className="text-[10px] text-zinc-600">+{brand.models.length - 3} more</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
