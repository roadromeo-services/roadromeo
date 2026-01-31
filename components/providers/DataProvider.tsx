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

interface DataState {
    services: Service[];
    pricing: PricingPackage[];
    bikes: BikeBrand[];
    loading: boolean;
    error: string | null;
}

interface DataContextType extends DataState {
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<DataState>({
        services: [],
        pricing: [],
        bikes: [],
        loading: true,
        error: null,
    });

    const fetchData = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            const [servicesRes, pricingRes, bikesRes] = await Promise.all([
                fetch('/api/services'),
                fetch('/api/pricing'),
                fetch('/api/bikes'),
            ]);

            if (!servicesRes.ok || !pricingRes.ok || !bikesRes.ok) {
                throw new Error('Failed to fetch data from server');
            }

            const [servicesData, pricingData, bikesData] = await Promise.all([
                servicesRes.json(),
                pricingRes.json(),
                bikesRes.json(),
            ]);

            setState({
                services: servicesData,
                pricing: pricingData,
                bikes: bikesData,
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

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <DataContext.Provider
            value={{
                ...state,
                refreshData: fetchData
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
