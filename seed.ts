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
        features: ['Engine oil change', 'Oil filter cleaning', 'Air filter cleaning', 'Spark plug check', 'Brake inspection', 'Chain lubrication', '20-point inspection']
    },
    {
        name: 'Oil Change',
        slug: 'oil-change',
        icon: 'Droplets',
        shortDescription: 'Premium engine oil replacement',
        description: 'Quality engine oil replacement with filter cleaning for smooth engine performance.',
        price: 499,
        duration: '30-45 mins',
        features: ['Engine oil drain', 'New oil fill (brand of choice)', 'Oil filter cleaning', 'Engine inspection']
    }
    // ... can add more later if needed
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
