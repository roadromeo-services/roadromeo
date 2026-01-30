import { Wrench, Droplets, Disc3, Cog, Battery, CircleDot, Sparkles, Shield, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  shortDescription: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

export const services: Service[] = [
  {
    id: 'general-service',
    name: 'General Service',
    slug: 'general-service',
    icon: Wrench,
    shortDescription: 'Complete inspection & maintenance',
    description: 'Full bike inspection including oil change, filter cleaning, brake check, chain lubrication, and 20+ checkpoint inspection.',
    price: 799,
    duration: '2-3 hours',
    popular: true,
    features: [
      'Engine oil change',
      'Oil filter cleaning',
      'Air filter cleaning',
      'Spark plug check',
      'Brake inspection',
      'Chain lubrication',
      '20-point inspection',
    ],
  },
  {
    id: 'oil-change',
    name: 'Oil Change',
    slug: 'oil-change',
    icon: Droplets,
    shortDescription: 'Premium engine oil replacement',
    description: 'Quality engine oil replacement with filter cleaning for smooth engine performance.',
    price: 499,
    duration: '30-45 mins',
    features: [
      'Engine oil drain',
      'New oil fill (brand of choice)',
      'Oil filter cleaning',
      'Engine inspection',
    ],
  },
  {
    id: 'brake-repair',
    name: 'Brake Repair',
    slug: 'brake-repair',
    icon: Disc3,
    shortDescription: 'Brake system inspection & repair',
    description: 'Complete brake system check including pads, discs, drums, and fluid for safe riding.',
    price: 599,
    duration: '1-2 hours',
    features: [
      'Brake pad inspection',
      'Disc/drum check',
      'Brake fluid top-up',
      'Cable adjustment',
      'Brake testing',
    ],
  },
  {
    id: 'engine-repair',
    name: 'Engine Repair',
    slug: 'engine-repair',
    icon: Cog,
    shortDescription: 'Engine diagnostics & repair',
    description: 'Expert engine diagnosis and repair for all types of engine issues.',
    price: 1499,
    duration: '4-8 hours',
    features: [
      'Engine diagnostics',
      'Parts replacement',
      'Timing adjustment',
      'Carburetor tuning',
      'Performance testing',
    ],
  },
  {
    id: 'battery-replacement',
    name: 'Battery Replacement',
    slug: 'battery-replacement',
    icon: Battery,
    shortDescription: 'Battery check & replacement',
    description: 'Battery health check and replacement with quality batteries.',
    price: 299,
    duration: '30 mins',
    features: [
      'Battery health check',
      'Terminal cleaning',
      'New battery installation',
      'Charging system check',
    ],
  },
  {
    id: 'tyre-service',
    name: 'Tyre Service',
    slug: 'tyre-service',
    icon: CircleDot,
    shortDescription: 'Tyre replacement & puncture repair',
    description: 'Tyre inspection, puncture repair, and replacement services.',
    price: 199,
    duration: '30-60 mins',
    features: [
      'Tyre inspection',
      'Puncture repair',
      'Tyre replacement',
      'Wheel balancing',
      'Air pressure check',
    ],
  },
  {
    id: 'ceramic-coating',
    name: 'Ceramic Coating',
    slug: 'ceramic-coating',
    icon: Sparkles,
    shortDescription: 'Premium paint protection',
    description: 'Long-lasting ceramic coating for ultimate paint protection and shine.',
    price: 4999,
    duration: '1-2 days',
    popular: true,
    features: [
      'Surface preparation',
      'Paint correction',
      'Ceramic coating application',
      '2-year protection',
      'Hydrophobic finish',
      'UV protection',
    ],
  },
  {
    id: 'paint-protection-film',
    name: 'Paint Protection Film',
    slug: 'paint-protection-film',
    icon: Shield,
    shortDescription: 'PPF for scratch protection',
    description: 'Invisible paint protection film to guard against scratches and stone chips.',
    price: 7999,
    duration: '1-2 days',
    features: [
      'Surface cleaning',
      'PPF application',
      'Self-healing technology',
      '5-year warranty',
      'Invisible protection',
    ],
  },
  {
    id: 'bike-wash-polish',
    name: 'Bike Wash & Polish',
    slug: 'bike-wash-polish',
    icon: Waves,
    shortDescription: 'Deep cleaning & shine',
    description: 'Complete bike wash with wax polish for a showroom finish.',
    price: 299,
    duration: '1 hour',
    features: [
      'Pressure wash',
      'Degreasing',
      'Chain cleaning',
      'Wax polish',
      'Chrome polishing',
    ],
  },
];

export const getServiceBySlug = (slug: string) => services.find(s => s.slug === slug);
export const getPopularServices = () => services.filter(s => s.popular);
