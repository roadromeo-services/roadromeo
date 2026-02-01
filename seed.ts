import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

// Models - Using absolute paths to avoid issues
import Service from './models/Service';
import Pricing from './models/Pricing';
import BikeBrand from './models/BikeBrand';
import User from './models/User';

const servicesData = [
 {
     name: 'General Service',
    slug: 'general-service',
    icon: 'Wrench',
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
    name: 'Oil Change',
    slug: 'oil-change',
    icon: 'Droplets',
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
   name: 'Brake Repair',
    slug: 'brake-repair',
    icon: 'Disc3',
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
     name: 'Engine Repair',
    slug: 'engine-repair',
    icon: 'Cog',
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
    name: 'Battery Replacement',
    slug: 'battery-replacement',
    icon: 'Battery',
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
    name: 'Tyre Service',
    slug: 'tyre-service',
    icon: 'CircleDot',
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
    name: 'Ceramic Coating',
    slug: 'ceramic-coating',
    icon: 'Sparkles',
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
 
    name: 'Paint Protection Film',
    slug: 'paint-protection-film',
    icon: 'Shield',
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
    name: 'Bike Wash & Polish',
    slug: 'bike-wash-polish',
    icon: 'Waves',
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

const pricingData = [
    {
        name: 'Basic Service',
        price: 499,
        description: 'Essential maintenance for your bike',
        features: ['Engine oil change', 'Air filter cleaning', 'Basic inspection', 'Chain lubrication']
    },
    {
        name: 'Standard Service',
        price: 799,
        description: 'Complete service package',
        popular: true,
        badge: 'Most Popular',
        features: ['Everything in Basic', 'Brake inspection & adjustment', 'Spark plug cleaning', 'Carburetor tuning', 'Full body wash', '20-point inspection']
    },
    {
        name: 'Premium Service',
        price: 1299,
        description: 'Comprehensive care for your bike',
        features: ['Everything in Standard', 'Deep engine cleaning', 'Fuel system cleaning', 'Electrical check', 'Suspension check', 'Wax polish', 'Priority support']
    }
];

const bikeBrandsData = [
    { name: 'Hero', models: ['Splendor Plus', 'HF Deluxe', 'Passion Pro', 'Glamour', 'Xtreme 160R', 'Xpulse 200', 'XPulse 210'] },
    { name: 'Honda', models: ['Activa 6G', 'Shine', 'Unicorn', 'SP 125', 'Hornet 2.0', 'CB350', 'Dio'] },
    { name: 'Bajaj', models: ['Pulsar 150', 'Pulsar NS200', 'Pulsar RS200', 'Dominar 400', 'Platina', 'CT100'] },
    { name: 'TVS', models: ['Apache RTR 160', 'Apache RTR 200', 'Jupiter', 'Ntorq', 'Raider', 'Star City'] },
    { name: 'Yamaha', models: ['FZ-S', 'MT-15', 'R15 V4', 'Fascino', 'Ray ZR', 'FZ-X'] },
    { name: 'Royal Enfield', models: ['Classic 350', 'Bullet 350', 'Meteor 350', 'Hunter 350', 'Himalayan', 'Continental GT'] }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected to MongoDB');

        await Service.deleteMany({});
        await Pricing.deleteMany({});
        await BikeBrand.deleteMany({});
        await User.deleteMany({});

        await Service.insertMany(servicesData);
        console.log('Services seeded');

        await Pricing.insertMany(pricingData);
        console.log('Pricing seeded');

        await BikeBrand.insertMany(bikeBrandsData);
        console.log('Bikes seeded');

        const hashedPassword = await bcrypt.hash('admin123', 12);
        await User.create({
            email: 'admin@roadromeo.in',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Admin user seeded: admin@roadromeo.in / admin123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();
