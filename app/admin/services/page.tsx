'use client';

import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2, Search, ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useData } from '@/components/providers/DataProvider';
import { getIcon } from '@/lib/icons';

// Curated icons relevant to bike/auto services, shown first
const SUGGESTED_ICONS = [
    'Wrench', 'Cog', 'Settings', 'Fuel', 'Droplets', 'Zap', 'Shield', 'ShieldCheck',
    'Sparkles', 'Star', 'Paintbrush', 'Disc', 'CircleDot', 'Battery', 'BatteryCharging',
    'Gauge', 'Bike', 'Car', 'Timer', 'Clock', 'CheckCircle', 'Award', 'BadgeCheck',
    'Hammer', 'ScanLine', 'Thermometer', 'Wind', 'Layers', 'Package', 'Tag',
];

// Get all valid icon names from lucide-react (components are PascalCase functions)
const ALL_ICON_NAMES = Object.keys(LucideIcons).filter(
    (key) => typeof (LucideIcons as any)[key] === 'object' && key[0] === key[0].toUpperCase() && key !== 'default' && !key.startsWith('create') && !key.startsWith('Icon')
);

export default function ServicesManagement() {
    const { services, loading, refreshData } = useData();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [iconPickerOpen, setIconPickerOpen] = useState(false);
    const [iconSearch, setIconSearch] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        price: 0,
        duration: '',
        shortDescription: '',
        description: '',
        icon: 'Wrench',
        popular: false,
        features: [] as string[]
    });

    const filteredIcons = useMemo(() => {
        const query = iconSearch.toLowerCase();
        if (!query) return SUGGESTED_ICONS;
        return ALL_ICON_NAMES.filter((name) => name.toLowerCase().includes(query)).slice(0, 60);
    }, [iconSearch]);

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
                setFormData({ name: '', slug: '', price: 0, duration: '', shortDescription: '', description: '', icon: 'Wrench', popular: false, features: [] });
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
                <div className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-xl">
                    <h3 className="text-xl font-bold mb-6 text-zinc-900">{isAdding ? 'Add New Service' : 'Edit Service'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-500">Service Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:border-red-600 outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-500">Slug</label>
                            <input
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:border-red-600 outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-500">Price (₹)</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:border-red-600 outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-500">Duration</label>
                            <input
                                required
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:border-red-600 outline-none transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-zinc-500">Short Description (for cards)</label>
                            <input
                                required
                                value={formData.shortDescription}
                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:border-red-600 outline-none transition-colors"
                                placeholder="Brief summary for service cards"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-zinc-500">Detailed Description</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 h-32 focus:border-red-600 outline-none transition-colors resize-none"
                            />
                        </div>
                        {/* Features Management */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-zinc-500">Service Features</label>
                            <div className="space-y-3">
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => {
                                                const newFeatures = [...formData.features];
                                                newFeatures[index] = e.target.value;
                                                setFormData({ ...formData, features: newFeatures });
                                            }}
                                            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:border-red-600 outline-none transition-colors"
                                            placeholder="Enter feature description"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newFeatures = formData.features.filter((_, i) => i !== index);
                                                setFormData({ ...formData, features: newFeatures });
                                            }}
                                            className="p-3 bg-zinc-100 hover:bg-red-600 hover:text-white text-zinc-600 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                                    className="w-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-red-600 text-zinc-600 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Feature
                                </button>
                            </div>
                        </div>
                        {/* Icon Picker */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-zinc-500">Service Icon</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIconPickerOpen(!iconPickerOpen)}
                                    className="w-full flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 hover:border-red-600 outline-none transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {(() => { const Icon = getIcon(formData.icon); return <Icon className="w-5 h-5 text-red-600" />; })()}
                                        <span className="font-medium">{formData.icon}</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${iconPickerOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {iconPickerOpen && (
                                    <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-2xl shadow-2xl p-4 max-h-80 overflow-hidden flex flex-col">
                                        <div className="relative mb-3">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                            <input
                                                type="text"
                                                placeholder="Search icons..."
                                                value={iconSearch}
                                                onChange={(e) => setIconSearch(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-red-600 text-sm transition-colors"
                                            />
                                        </div>
                                        <div className="overflow-y-auto grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                                            {filteredIcons.map((name) => {
                                                const Icon = getIcon(name);
                                                return (
                                                    <button
                                                        key={name}
                                                        type="button"
                                                        title={name}
                                                        onClick={() => {
                                                            setFormData({ ...formData, icon: name });
                                                            setIconPickerOpen(false);
                                                            setIconSearch('');
                                                        }}
                                                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all hover:bg-red-50 hover:text-red-600 ${formData.icon === name ? 'bg-red-600 text-white hover:bg-red-700 hover:text-white' : 'text-zinc-600'}`}
                                                    >
                                                        <Icon className="w-5 h-5" />
                                                    </button>
                                                );
                                            })}
                                            {filteredIcons.length === 0 && (
                                                <p className="col-span-full text-center text-zinc-400 text-sm py-4">No icons found</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="popular"
                                checked={formData.popular}
                                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                className="w-5 h-5 rounded border-zinc-300 bg-white accent-red-600"
                            />
                            <label htmlFor="popular" className="text-sm font-medium text-zinc-500">Mark as Popular</label>
                        </div>
                        <div className="md:col-span-2 flex gap-4 mt-4">
                            <button
                                type="submit"
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-red-600/20"
                            >
                                <Save className="w-5 h-5" />
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsAdding(false); setEditingId(null); }}
                                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors"
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
                    {services.map((service) => {
                        const ServiceIcon = getIcon(service.icon);
                        return (
                            <div key={service._id} className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 hover:shadow-xl transition-all group relative">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            setEditingId(service._id);
                                            setFormData({
                                                ...service,
                                                features: service.features || []
                                            });
                                            setIsAdding(false);
                                        }}
                                        className="p-2 bg-zinc-100 hover:bg-blue-600 hover:text-white text-zinc-600 rounded-lg transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteService(service._id)}
                                        className="p-2 bg-zinc-100 hover:bg-red-600 hover:text-white text-zinc-600 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                                    <ServiceIcon className="w-6 h-6 text-red-600" />
                                </div>
                                <h4 className="text-xl font-bold mb-1 text-zinc-900">{service.name}</h4>
                                <p className="text-red-600 font-bold mb-4">₹{service.price}</p>
                                <p className="text-zinc-500 text-sm line-clamp-2">{service.description}</p>
                                {service.features && service.features.length > 0 && (
                                    <div className="mt-4 space-y-1">
                                        {service.features.slice(0, 3).map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-xs text-zinc-600">
                                                <span className="text-red-600 mt-0.5">✓</span>
                                                <span className="line-clamp-1">{feature}</span>
                                            </div>
                                        ))}
                                        {service.features.length > 3 && (
                                            <p className="text-xs text-zinc-400 pl-4">+{service.features.length - 3} more</p>
                                        )}
                                    </div>
                                )}
                                <div className="mt-6 flex items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                    <span>{service.duration}</span>
                                    {service.popular && <span className="text-orange-500">Popular</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
