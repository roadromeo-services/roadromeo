'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2 } from 'lucide-react';
import { useData } from '@/components/providers/DataProvider';

export default function ServicesManagement() {
    const { services, loading, refreshData } = useData();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        price: 0,
        duration: '',
        shortDescription: '',
        description: '',
        icon: 'Wrench',
        popular: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isAdding ? '/api/services' : `/api/services/${editingId}`;
        const method = isAdding ? 'POST' : 'PUT';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsAdding(false);
                setEditingId(null);
                refreshData();
                setFormData({ name: '', slug: '', price: 0, duration: '', shortDescription: '', description: '', icon: 'Wrench', popular: false });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`/api/services/${id}`, { method: 'DELETE' });
            refreshData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black">Services</h2>
                    <p className="text-zinc-400">Manage all bike services offered on the platform.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Service
                </button>
            </div>

            {(isAdding || editingId) && (
                <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
                    <h3 className="text-xl font-bold mb-6">{isAdding ? 'Add New Service' : 'Edit Service'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Service Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Slug</label>
                            <input
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Price (₹)</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Duration</label>
                            <input
                                required
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Short Description (for cards)</label>
                            <input
                                required
                                value={formData.shortDescription}
                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none"
                                placeholder="Brief summary for service cards"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Detailed Description</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white h-32 focus:border-red-600 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="popular"
                                checked={formData.popular}
                                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 accent-red-600"
                            />
                            <label htmlFor="popular" className="text-sm font-medium text-zinc-400">Mark as Popular</label>
                        </div>
                        <div className="md:col-span-2 flex gap-4 mt-4">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsAdding(false); setEditingId(null); }}
                                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service._id} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-red-600 transition-all group relative">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        setEditingId(service._id);
                                        setFormData(service);
                                        setIsAdding(false);
                                    }}
                                    className="p-2 bg-zinc-800 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => deleteService(service._id)}
                                    className="p-2 bg-zinc-800 hover:bg-red-600 text-white rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <h4 className="text-xl font-bold mb-1">{service.name}</h4>
                            <p className="text-red-500 font-bold mb-4">₹{service.price}</p>
                            <p className="text-zinc-500 text-sm line-clamp-2">{service.description}</p>
                            <div className="mt-6 flex items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                <span>{service.duration}</span>
                                {service.popular && <span className="text-orange-500">Popular</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
