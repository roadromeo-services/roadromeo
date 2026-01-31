'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
    serviceType: string;
    bookingDate: string;
    status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
    totalAmount: number;
    notes?: string;
}

interface Billing {
    _id: string;
    bookingId: string | any;
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
}

interface DataState {
    services: Service[];
    pricing: PricingPackage[];
    bikes: BikeBrand[];
    bookings: Booking[];
    billing: Billing[];
    loading: boolean;
    error: string | null;
}

interface DataContextType extends DataState {
    refreshData: () => Promise<void>;
    addBooking: (bookingData: any) => Promise<any>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<DataState>({
        services: [],
        pricing: [],
        bikes: [],
        bookings: [],
        billing: [],
        loading: true,
        error: null,
    });

    const fetchData = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            const [servicesRes, pricingRes, bikesRes, bookingsRes, billingRes] = await Promise.all([
                fetch('/api/services'),
                fetch('/api/pricing'),
                fetch('/api/bikes'),
                fetch('/api/bookings'),
                fetch('/api/billing'),
            ]);

            // Note: billing might return 401 if not logged in, we should handle that gracefully
            const servicesData = await servicesRes.json();
            const pricingData = await pricingRes.json();
            const bikesData = await bikesRes.json();
            const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
            const billingData = billingRes.ok ? await billingRes.json() : [];

            setState({
                services: servicesData,
                pricing: pricingData,
                bikes: bikesData,
                bookings: bookingsData,
                billing: billingData,
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
    }, []);

    const addBooking = async (bookingData: any) => {
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            if (!res.ok) throw new Error('Failed to create booking');

            const newBooking = await res.json();

            // Refresh bookings list
            fetchData();

            return newBooking;
        } catch (err) {
            console.error('Error adding booking:', err);
            throw err;
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
                addBooking
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
