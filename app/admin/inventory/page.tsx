'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useData } from '@/components/providers/DataProvider';
import {
    Loader2, Package, Search, Plus, Trash2, Edit2,
    Save, X, ScanBarcode, AlertTriangle, ArrowUpDown,
    PackagePlus, PackageMinus, Filter
} from 'lucide-react';

const CATEGORIES = [
    { value: 'spare-part', label: 'Spare Part' },
    { value: 'oil', label: 'Oil & Lubricant' },
    { value: 'accessory', label: 'Accessory' },
    { value: 'consumable', label: 'Consumable' },
    { value: 'other', label: 'Other' },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    'spare-part': { bg: 'bg-blue-50', text: 'text-blue-600' },
    'oil': { bg: 'bg-amber-50', text: 'text-amber-600' },
    'accessory': { bg: 'bg-purple-50', text: 'text-purple-600' },
    'consumable': { bg: 'bg-green-50', text: 'text-green-600' },
    'other': { bg: 'bg-zinc-50', text: 'text-zinc-600' },
};

export default function InventoryManagement() {
    const { products, createProduct, updateProduct, deleteProduct, loading } = useData();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'recent'>('recent');
    const [scanMode, setScanMode] = useState<false | 'in' | 'out'>(false);
    const [stockAdjust, setStockAdjust] = useState<{ id: string; type: 'in' | 'out'; amount: number } | null>(null);

    // Barcode scanner input ref
    const barcodeInputRef = useRef<HTMLInputElement>(null);
    const barcodeBufferRef = useRef('');
    const barcodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Focus barcode input when scan mode is active
    useEffect(() => {
        if (scanMode && barcodeInputRef.current) {
            barcodeInputRef.current.focus();
        }
    }, [scanMode]);

    const handleBarcodeScan = useCallback(async (barcode: string) => {
        const trimmed = barcode.trim();
        if (!trimmed) return;

        // Check if product already exists
        const existing = products.find(p => p.barcode === trimmed);
        if (existing) {
            if (scanMode === 'out') {
                // Direct stock-out: reduce by 1 immediately
                if (existing.stock <= 0) {
                    alert(`${existing.name} is already out of stock!`);
                    return;
                }
                try {
                    await updateProduct(existing._id, { stock: existing.stock - 1 });
                } catch {
                    alert('Failed to update stock');
                }
            } else {
                // Stock-in mode: open adjustment dialog (default)
                setStockAdjust({ id: existing._id, type: 'in', amount: 1 });
                setScanMode(false);
            }
        } else {
            if (scanMode === 'out') {
                alert(`No product found with barcode: ${trimmed}`);
                return;
            }
            // Open add form with barcode pre-filled
            setIsAdding(true);
            setEditData({
                name: '',
                barcode: trimmed,
                category: 'other',
                price: 0,
                costPrice: 0,
                stock: 1,
                unit: 'pcs',
                description: '',
                minStock: 5,
            });
            setScanMode(false);
        }
    }, [products, scanMode, updateProduct]);

    // Handle barcode input — USB scanners type fast and end with Enter
    const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = (e.target as HTMLInputElement).value;
            handleBarcodeScan(val);
            (e.target as HTMLInputElement).value = '';
        }
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await updateProduct(editingId, editData);
            } else {
                await createProduct(editData);
            }
            setEditingId(null);
            setIsAdding(false);
            setEditData(null);
        } catch (err: any) {
            alert(err.message || 'Failed to save product');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        try {
            await deleteProduct(id);
        } catch {
            alert('Failed to delete product');
        }
    };

    const handleStockAdjust = async () => {
        if (!stockAdjust) return;
        const product = products.find(p => p._id === stockAdjust.id);
        if (!product) return;

        const newStock = stockAdjust.type === 'in'
            ? product.stock + stockAdjust.amount
            : Math.max(0, product.stock - stockAdjust.amount);

        try {
            await updateProduct(stockAdjust.id, { stock: newStock });
            setStockAdjust(null);
        } catch {
            alert('Failed to update stock');
        }
    };

    // Filter & sort
    const filteredProducts = products
        .filter(p => {
            if (filterCategory !== 'all' && p.category !== filterCategory) return false;
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return p.name.toLowerCase().includes(q) ||
                p.barcode.toLowerCase().includes(q) ||
                (p.sku?.toLowerCase().includes(q) ?? false);
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name': return a.name.localeCompare(b.name);
                case 'stock': return a.stock - b.stock;
                case 'price': return b.price - a.price;
                default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

    const lowStockProducts = products.filter(p => p.stock <= (p.minStock || 5));

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-zinc-900">Inventory</h2>
                    <p className="text-zinc-500 text-sm">Manage products, parts & stock levels.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setScanMode(scanMode === 'in' ? false : 'in')}
                        className={`font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all text-sm ${
                            scanMode === 'in'
                                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                    >
                        <PackagePlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Scan In</span>
                    </button>
                    <button
                        onClick={() => setScanMode(scanMode === 'out' ? false : 'out')}
                        className={`font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all text-sm ${
                            scanMode === 'out'
                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                    >
                        <PackageMinus className="w-4 h-4" />
                        <span className="hidden sm:inline">Scan Out</span>
                    </button>
                    {!isAdding && !editingId && (
                        <button
                            onClick={() => {
                                setIsAdding(true);
                                setEditData({
                                    name: '',
                                    barcode: '',
                                    category: 'other',
                                    price: 0,
                                    costPrice: 0,
                                    stock: 0,
                                    unit: 'pcs',
                                    description: '',
                                    minStock: 5,
                                });
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-600/20 text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Product
                        </button>
                    )}
                </div>
            </div>

            {/* Barcode Scanner Input */}
            {scanMode && (
                <div className={`p-4 rounded-2xl border-2 animate-in fade-in ${
                    scanMode === 'out'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-green-50 border-green-200'
                }`}>
                    <div className="flex items-center gap-3 mb-3">
                        <ScanBarcode className={`w-5 h-5 animate-pulse ${
                            scanMode === 'out' ? 'text-red-600' : 'text-green-600'
                        }`} />
                        <p className={`text-sm font-bold ${
                            scanMode === 'out' ? 'text-red-800' : 'text-green-800'
                        }`}>
                            {scanMode === 'out'
                                ? 'STOCK OUT — Scan barcode to remove 1 unit'
                                : 'STOCK IN — Scan barcode to add stock'}
                        </p>
                    </div>
                    <input
                        ref={barcodeInputRef}
                        type="text"
                        placeholder="Waiting for barcode scan..."
                        onKeyDown={handleBarcodeKeyDown}
                        className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-lg font-mono outline-none transition-colors ${
                            scanMode === 'out'
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-green-300 focus:border-green-500'
                        }`}
                        autoFocus
                    />
                    <p className={`text-xs mt-2 ${
                        scanMode === 'out' ? 'text-red-600' : 'text-green-600'
                    }`}>
                        {scanMode === 'out'
                            ? 'Each scan removes 1 unit. Keep scanning for multiple items.'
                            : 'If product exists: opens stock adjustment. If new: opens add form with barcode pre-filled.'}
                    </p>
                </div>
            )}

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <h3 className="text-sm font-bold text-red-700">Low Stock Alert ({lowStockProducts.length})</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {lowStockProducts.map(p => (
                            <span key={p._id} className="px-3 py-1 bg-white border border-red-200 rounded-lg text-xs font-bold text-red-600">
                                {p.name} ({p.stock} {p.unit})
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Stock Adjustment Modal */}
            {stockAdjust && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-zinc-900 mb-4">Adjust Stock</h3>
                        <p className="text-sm text-zinc-500 mb-4">
                            {products.find(p => p._id === stockAdjust.id)?.name}
                            <span className="ml-2 font-mono text-zinc-400">
                                (Current: {products.find(p => p._id === stockAdjust.id)?.stock})
                            </span>
                        </p>
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setStockAdjust({ ...stockAdjust, type: 'in' })}
                                className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                    stockAdjust.type === 'in'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-zinc-100 text-zinc-600'
                                }`}
                            >
                                <PackagePlus className="w-4 h-4" /> Stock In
                            </button>
                            <button
                                onClick={() => setStockAdjust({ ...stockAdjust, type: 'out' })}
                                className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                    stockAdjust.type === 'out'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-zinc-100 text-zinc-600'
                                }`}
                            >
                                <PackageMinus className="w-4 h-4" /> Stock Out
                            </button>
                        </div>
                        <input
                            type="number"
                            min="1"
                            value={stockAdjust.amount}
                            onChange={(e) => setStockAdjust({ ...stockAdjust, amount: Number(e.target.value) })}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-center text-2xl font-black outline-none focus:border-red-600 mb-4"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStockAdjust(null)}
                                className="flex-1 py-2.5 rounded-xl bg-zinc-100 text-zinc-600 font-bold text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStockAdjust}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Form */}
            {(isAdding || editingId) && editData && (
                <div className="bg-white rounded-2xl border border-zinc-200 p-5 lg:p-8 shadow-xl animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-zinc-900">
                            {editingId ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        <div className="flex items-center gap-2">
                            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all">
                                <Save className="w-4 h-4" /> Save
                            </button>
                            <button onClick={() => { setEditingId(null); setIsAdding(false); setEditData(null); }} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-xl">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-zinc-400">Product Name *</label>
                            <input
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                                placeholder="e.g., Engine Oil 10W40"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-zinc-400">Barcode *</label>
                            <input
                                value={editData.barcode}
                                onChange={(e) => setEditData({ ...editData, barcode: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-mono outline-none focus:border-red-600"
                                placeholder="Scan or enter barcode"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-zinc-400">Category</label>
                            <select
                                value={editData.category}
                                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-zinc-400">SKU (optional)</label>
                            <input
                                value={editData.sku || ''}
                                onChange={(e) => setEditData({ ...editData, sku: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                                placeholder="e.g., OIL-10W40-1L"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-zinc-400">Selling Price (₹) *</label>
                            <input
                                type="number"
                                value={editData.price}
                                onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-zinc-400">Cost Price (₹)</label>
                            <input
                                type="number"
                                value={editData.costPrice || 0}
                                onChange={(e) => setEditData({ ...editData, costPrice: Number(e.target.value) })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-zinc-400">Stock Quantity</label>
                            <input
                                type="number"
                                value={editData.stock}
                                onChange={(e) => setEditData({ ...editData, stock: Number(e.target.value) })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-zinc-400">Unit</label>
                            <input
                                value={editData.unit}
                                onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                                placeholder="pcs, litre, set..."
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-zinc-400">Min Stock Alert</label>
                            <input
                                type="number"
                                value={editData.minStock || 5}
                                onChange={(e) => setEditData({ ...editData, minStock: Number(e.target.value) })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-zinc-400">Description</label>
                            <input
                                value={editData.description || ''}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
                                placeholder="Optional description"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Search, Filter & Sort Bar */}
            {!isAdding && !editingId && (
                <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, barcode, or SKU..."
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 transition-colors text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-red-500"
                            >
                                <option value="all">All Categories</option>
                                {CATEGORIES.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-red-500"
                            >
                                <option value="recent">Recent</option>
                                <option value="name">Name</option>
                                <option value="stock">Low Stock</option>
                                <option value="price">Price</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-100">
                        <div className="bg-white p-4 text-center">
                            <p className="text-2xl font-black text-zinc-900">{products.length}</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Total Products</p>
                        </div>
                        <div className="bg-white p-4 text-center">
                            <p className="text-2xl font-black text-emerald-600">
                                {products.reduce((sum, p) => sum + p.stock, 0)}
                            </p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Total Stock</p>
                        </div>
                        <div className="bg-white p-4 text-center">
                            <p className="text-2xl font-black text-red-600">{lowStockProducts.length}</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Low Stock</p>
                        </div>
                        <div className="bg-white p-4 text-center">
                            <p className="text-2xl font-black text-zinc-900">
                                ₹{products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString('en-IN')}
                            </p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Stock Value</p>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="divide-y divide-zinc-100">
                        {filteredProducts.length === 0 ? (
                            <div className="px-8 py-16 text-center">
                                <Package className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                                <p className="font-medium text-zinc-900">{searchQuery ? 'No matching products' : 'No products yet'}</p>
                                <p className="text-sm text-zinc-400 mt-1">Add your first product or scan a barcode to get started.</p>
                            </div>
                        ) : (
                            filteredProducts.map((product) => {
                                const catColor = CATEGORY_COLORS[product.category] || CATEGORY_COLORS.other;
                                const isLowStock = product.stock <= (product.minStock || 5);
                                return (
                                    <div key={product._id} className="p-4 hover:bg-zinc-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-bold text-zinc-900 text-sm">{product.name}</p>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${catColor.bg} ${catColor.text}`}>
                                                        {CATEGORIES.find(c => c.value === product.category)?.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                                                    <span className="font-mono">{product.barcode}</span>
                                                    {product.sku && <span>SKU: {product.sku}</span>}
                                                </div>
                                            </div>

                                            {/* Stock */}
                                            <div className="text-center shrink-0">
                                                <p className={`text-lg font-black ${isLowStock ? 'text-red-600' : 'text-zinc-900'}`}>
                                                    {product.stock}
                                                </p>
                                                <p className="text-[10px] text-zinc-400">{product.unit}</p>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right shrink-0 hidden sm:block">
                                                <p className="text-sm font-black text-zinc-900">₹{product.price}</p>
                                                {product.costPrice && (
                                                    <p className="text-[10px] text-zinc-400">Cost: ₹{product.costPrice}</p>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    onClick={() => setStockAdjust({ id: product._id, type: 'in', amount: 1 })}
                                                    className="p-2 text-zinc-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                    title="Adjust Stock"
                                                >
                                                    <PackagePlus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingId(product._id);
                                                        setEditData({
                                                            name: product.name,
                                                            barcode: product.barcode,
                                                            sku: product.sku || '',
                                                            category: product.category,
                                                            price: product.price,
                                                            costPrice: product.costPrice || 0,
                                                            stock: product.stock,
                                                            unit: product.unit,
                                                            description: product.description || '',
                                                            minStock: product.minStock || 5,
                                                        });
                                                    }}
                                                    className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
