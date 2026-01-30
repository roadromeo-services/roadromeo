export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export const pricingPackages: PricingPackage[] = [
  {
    id: 'basic',
    name: 'Basic Service',
    price: 499,
    description: 'Essential maintenance for your bike',
    features: [
      'Engine oil change',
      'Air filter cleaning',
      'Basic inspection',
      'Chain lubrication',
    ],
  },
  {
    id: 'standard',
    name: 'Standard Service',
    price: 799,
    description: 'Complete service package',
    popular: true,
    badge: 'Most Popular',
    features: [
      'Everything in Basic',
      'Brake inspection & adjustment',
      'Spark plug cleaning',
      'Carburetor tuning',
      'Full body wash',
      '20-point inspection',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Service',
    price: 1299,
    description: 'Comprehensive care for your bike',
    features: [
      'Everything in Standard',
      'Deep engine cleaning',
      'Fuel system cleaning',
      'Electrical check',
      'Suspension check',
      'Wax polish',
      'Priority support',
    ],
  },
];

export const getPackageById = (id: string) => pricingPackages.find(p => p.id === id);
