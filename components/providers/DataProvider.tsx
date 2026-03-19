'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface Service {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    shortDescription: string;
    description: string;
    price: number;
    duration: string;
    features: string[];
    popular: boolean;
}

interface PricingPackage {
    _id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    popular: boolean;
    badge?: string;
}

interface BikeBrand {
    _id: string;
    name: string;
    logo?: string;
    models: string[];
}

interface Booking {
    _id: string;
    customerName: string;
    phoneNumber: string;
    email?: string;
    bikeBrand: string;
    bikeModel: string;
    vehicleType: 'bike' | 'scooter';
    vehicleNumber?: string;
    address?: string;
    serviceType: string;
    bookingDate: string;
    status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
    totalAmount: number;
    notes?: string;
    isPickup?: boolean;
}

interface Billing {
    _id: string;
    invoiceNumber: string;
    items: {
        description: string;
        quantity: number;
        price: number;
    }[];
    tax: number;
    discount: number;
    totalAmount: number;
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentMethod?: string;
    createdAt: string;
    updatedAt: string;
    vehicleNumber?: string;
    customerName?: string;
    phoneNumber?: string;
}

interface Product {
    _id: string;
    name: string;
    barcode: string;
    sku?: string;
    category: 'spare-part' | 'oil' | 'accessory' | 'consumable' | 'other';
    price: number;
    costPrice?: number;
    stock: number;
    unit: string;
    description?: string;
    minStock?: number;
    createdAt: string;
    updatedAt: string;
}

interface DataState {
    services: Service[];
    pricing: PricingPackage[];
    bikes: BikeBrand[];
    bookings: Booking[];
    billing: Billing[];
    products: Product[];
    loading: boolean;
    error: string | null;
}

interface DataContextType extends DataState {
    refreshData: () => Promise<void>;
    addBooking: (bookingData: any) => Promise<any>;
    updateBooking: (id: string, data: any) => Promise<any>;
    deleteBooking: (id: string) => Promise<void>;
    createBilling: (billingData: any) => Promise<any>;
    updateBilling: (id: string, data: any) => Promise<any>;
    deleteBilling: (id: string) => Promise<void>;
    createProduct: (data: any) => Promise<any>;
    updateProduct: (id: string, data: any) => Promise<any>;
    deleteProduct: (id: string) => Promise<void>;
    searchProducts: (query: string) => Promise<Product[]>;
    lookupBarcode: (barcode: string) => Promise<Product | null>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    const [state, setState] = useState<DataState>({
        services: [],
        pricing: [],
        bikes: [],
        bookings: [],
        billing: [],
        products: [],
        loading: true,
        error: null,
    });

    const fetchData = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            const commonFetches = [
                fetch('/api/services'),
                fetch('/api/pricing'),
                fetch('/api/bikes'),
            ];

            const [servicesRes, pricingRes, bikesRes] = await Promise.all(commonFetches);

            const servicesData = await servicesRes.json();
            const pricingData = await pricingRes.json();
            const bikesData = await bikesRes.json();

            let bookingsData: any[] = [];
            let billingData: any[] = [];
            let productsData: any[] = [];

            if (isAdmin) {
                const [bookingsRes, billingRes, productsRes] = await Promise.all([
                    fetch('/api/bookings'),
                    fetch('/api/billing'),
                    fetch('/api/products'),
                ]);
                bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
                billingData = billingRes.ok ? await billingRes.json() : [];
                productsData = productsRes.ok ? await productsRes.json() : [];
            }

            setState({
                services: servicesData,
                pricing: pricingData,
                bikes: bikesData,
                bookings: bookingsData,
                billing: billingData,
                products: productsData,
                loading: false,
                error: null,
            });
        } catch (err: any) {
            console.error('Error fetching dynamic data:', err);
            setState(prev => ({
                ...prev,
                loading: false,
                error: err.message || 'An error occurred while fetching data'
            }));
        }
    }, [isAdmin]);

    const addBooking = async (bookingData: any) => {
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });
            if (!res.ok) throw new Error('Failed to create booking');
            const newBooking = await res.json();
            fetchData();
            return newBooking;
        } catch (err) {
            console.error('Error adding booking:', err);
            throw err;
        }
    };

    const updateBooking = async (id: string, data: any) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update booking');
            const updated = await res.json();
            fetchData();
            return updated;
        } catch (err) {
            console.error('Error updating booking:', err);
            throw err;
        }
    };

    const deleteBooking = async (id: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete booking');
            fetchData();
        } catch (err) {
            console.error('Error deleting booking:', err);
            throw err;
        }
    };

    const createBilling = async (billingData: any) => {
        try {
            const res = await fetch('/api/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(billingData),
            });
            if (!res.ok) throw new Error('Failed to create billing');
            const newBilling = await res.json();
            fetchData();
            return newBilling;
        } catch (err) {
            console.error('Error adding billing:', err);
            throw err;
        }
    };

    const updateBilling = async (id: string, data: any) => {
        try {
            const res = await fetch(`/api/billing/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update billing');
            const updated = await res.json();
            fetchData();
            return updated;
        } catch (err) {
            console.error('Error updating billing:', err);
            throw err;
        }
    };

    const deleteBilling = async (id: string) => {
        try {
            const res = await fetch(`/api/billing/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete billing');
            fetchData();
        } catch (err) {
            console.error('Error deleting billing:', err);
            throw err;
        }
    };

    const createProduct = async (data: any) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to create product');
            }
            const newProduct = await res.json();
            fetchData();
            return newProduct;
        } catch (err) {
            console.error('Error adding product:', err);
            throw err;
        }
    };

    const updateProduct = async (id: string, data: any) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update product');
            const updated = await res.json();
            fetchData();
            return updated;
        } catch (err) {
            console.error('Error updating product:', err);
            throw err;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete product');
            fetchData();
        } catch (err) {
            console.error('Error deleting product:', err);
            throw err;
        }
    };

    const searchProducts = async (query: string): Promise<Product[]> => {
        try {
            const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
            if (!res.ok) return [];
            return await res.json();
        } catch {
            return [];
        }
    };

    const lookupBarcode = async (barcode: string): Promise<Product | null> => {
        try {
            const res = await fetch(`/api/products?barcode=${encodeURIComponent(barcode)}`);
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <DataContext.Provider
            value={{
                ...state,
                refreshData: fetchData,
                addBooking,
                updateBooking,
                deleteBooking,
                createBilling,
                updateBilling,
                deleteBilling,
                createProduct,
                updateProduct,
                deleteProduct,
                searchProducts,
                lookupBarcode
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
