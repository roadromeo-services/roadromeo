'use client';
import { useState } from 'react';
import { Bike, CheckCircle, Smartphone, ShieldCheck, MapPin, User } from 'lucide-react';
import { Button, Select } from '@/components/common';
import { siteConfig } from '@/lib/config/site';
import { useEffect } from 'react';

import { useData } from '@/components/providers/DataProvider';

export const Hero = () => {
  const [name, setName] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [phone, setPhone] = useState('');

  const { bikes: bikeBrands, services, addBooking } = useData();

  const brandOptions = bikeBrands.map(brand => ({
    value: brand._id,
    label: brand.name,
  }));

  const modelOptions = selectedBrand
    ? (bikeBrands.find(b => (b._id) === selectedBrand)?.models || []).map((model: string) => ({
      value: model,
      label: model,
    }))
    : [];

  const serviceOptions = services.map(service => ({
    value: service._id,
    label: service.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const brandObj = bikeBrands.find(b => (b._id) === selectedBrand);
    const serviceObj = services.find(s => (s._id) === selectedService);

    const brandName = brandObj?.name || selectedBrand;
    const serviceName = serviceObj?.name || selectedService;

    // Save to database
    try {
      await addBooking({
        customerName: name,
        phoneNumber: phone,
        bikeBrand: brandName,
        bikeModel: selectedModel,
        serviceType: serviceName,
        bookingDate: new Date(),
        totalAmount: serviceObj?.price || 0,
        status: 'pending',
        notes: 'Booked from Hero section'
      });
    } catch (err) {
      console.error('Database booking failed, but proceeding to WhatsApp:', err);
    }

    const message = `Hi! I want to book a bike service.%0A%0A*Customer Details:*%0AName: ${name}%0APhone: ${phone}%0A%0A*Bike Details:*%0ABrand: ${brandName}%0AModel: ${selectedModel}%0AService: ${serviceName}`;
    const whatsappLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=${message}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-mesh py-24 lg:py-32 overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <span className="badge-premium bg-primary text-white scale-105">
              🚀 #1 Rated Service in Pune
            </span>

            <h1 className="section-heading mb-10">
              The Smarter Way to <span className="text-primary italic">Service</span> Your Bike.
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl leading-relaxed">
              Professional servicing with <span className="font-bold text-slate-900 underline decoration-primary/30 underline-offset-8">Zero-Cost Pickup & Drop</span>.
              We bring the workshop to your doorstep.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-12">
              <StatItem icon={Smartphone} label="Instant Booking" val="60s" />
              <StatItem icon={ShieldCheck} label="Service Warranty" val="10 Days" />
              <StatItem icon={MapPin} label="Across Pune" val="Free" />
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3 overflow-hidden p-2">
                {[1, 2, 3, 4].map(i => (
                  <img
                    key={i}
                    className="inline-block h-12 w-12 rounded-full ring-4 ring-white"
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                    alt="avatar"
                  />
                ))}
              </div>
              <div className="flex flex-col justify-center text-sm font-medium">
                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map(i => <span key={i}>★</span>)}
                </div>
                <span className="text-slate-600 underline">Trusted by 5,000+ Pune Riders</span>
              </div>
            </div>
          </div>

          {/* Right - Booking Form */}
          <div className="card-premium lg:mt-0 mt-12 animate-fade-in [animation-delay:200ms]">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                <Bike className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Book Now</h2>
                <p className="text-slate-500 font-medium">Instant Quote on WhatsApp</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    pattern="[a-zA-Z\s]{2,}"
                    required
                    className="input-premium !pl-14"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Brand</label>
                  <Select
                    options={brandOptions}
                    placeholder="Select Brand"
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setSelectedModel('');
                    }}
                    required
                    className="!bg-slate-50 !border-slate-100 !rounded-2xl !py-4 focus:!ring-primary/10 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Model</label>
                  <Select
                    options={modelOptions}
                    placeholder="Select Model"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={!selectedBrand}
                    required
                    className="!bg-slate-50 !border-slate-100 !rounded-2xl !py-4 focus:!ring-primary/10 transition-all duration-300 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Service Type</label>
                <Select
                  options={serviceOptions}
                  placeholder="What does your bike need?"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  className="!bg-slate-50 !border-slate-100 !rounded-2xl !py-4 focus:!ring-primary/10 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Mobile Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none font-bold text-slate-400 group-focus-within:text-primary transition-colors">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(val);
                    }}
                    placeholder="Enter 10-digit number"
                    pattern="[0-9]{10}"
                    required
                    className="input-premium !pl-16"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <span className="text-sm font-bold text-slate-700">Free Pickup & Drop included</span>
              </div>

              <Button type="submit" fullWidth className="btn-primary py-5 text-xl shadow-primary/20">
                Get Free Pickup
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatItem = ({ icon: Icon, label, val }: { icon: any, label: string, val: string }) => (
  <div className="flex items-center gap-3">
    <div className="p-3 bg-white shadow-md rounded-xl">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </span>
      <span className="text-lg font-black text-slate-800 leading-none">
        {val}
      </span>
    </div>
  </div>
);
