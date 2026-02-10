'use client';
import { useState } from 'react';
import { Bike, Smartphone, ShieldCheck, MapPin, User } from 'lucide-react';
import { Button, Select } from '@/components/common';
import { siteConfig } from '@/lib/config/site';
import { useEffect } from 'react';

import { useData } from '@/components/providers/DataProvider';

export const Hero = () => {
  const [name, setName] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isPickup, setIsPickup] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { bikes: bikeBrands, addBooking } = useData();

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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim() || !/^[a-zA-Z\s]{2,}$/.test(name.trim())) newErrors.name = 'Enter a valid name (min 2 letters)';
    if (!selectedBrand) newErrors.brand = 'Please select a brand';
    if (!selectedModel) newErrors.model = 'Please select a model';
    if (isPickup && !address.trim()) newErrors.address = 'Please enter your pickup address';
    if (!/^[0-9]{10}$/.test(phone)) newErrors.phone = 'Enter a valid 10-digit number';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const brandObj = bikeBrands.find(b => (b._id) === selectedBrand);

    const brandName = brandObj?.name || selectedBrand;

    // Save to database
    try {
      await addBooking({
        customerName: name,
        phoneNumber: phone,
        bikeBrand: brandName,
        bikeModel: selectedModel,
        address: isPickup ? address : '',
        bookingDate: new Date(),
        totalAmount: 0,
        status: 'pending',
        isPickup,
        notes: 'Booked from Hero section'
      });
    } catch (err) {
      console.error('Database booking failed, but proceeding to WhatsApp:', err);
    }

    const message = `Hi! I want to book a bike service.%0A%0A*Customer Details:*%0AName: ${name}%0APhone: ${phone}%0APickup: ${isPickup ? 'Yes' : 'No'}${isPickup ? `%0AAddress: ${address}` : ''}%0A%0A*Bike Details:*%0ABrand: ${brandName}%0AModel: ${selectedModel}`;
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
                    onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                    placeholder="Enter your name"
                    className={`input-premium !pl-14 ${errors.name ? '!border-red-500' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.name}</p>}
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
                      setErrors(prev => ({ ...prev, brand: '' }));
                    }}
                    className={`!bg-slate-50 !border-slate-100 !rounded-2xl !py-4 focus:!ring-primary/10 transition-all duration-300 ${errors.brand ? '!border-red-500' : ''}`}
                  />
                  {errors.brand && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.brand}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Model</label>
                  <Select
                    options={modelOptions}
                    placeholder="Select Model"
                    value={selectedModel}
                    onChange={(e) => { setSelectedModel(e.target.value); setErrors(prev => ({ ...prev, model: '' })); }}
                    disabled={!selectedBrand}
                    className={`!bg-slate-50 !border-slate-100 !rounded-2xl !py-4 focus:!ring-primary/10 transition-all duration-300 disabled:opacity-50 ${errors.model ? '!border-red-500' : ''}`}
                  />
                  {errors.model && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.model}</p>}
                </div>
              </div>

              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer select-none transition-all duration-300 ${isPickup ? 'bg-primary/5 border-primary/30' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300 ${isPickup ? 'bg-primary/15' : 'bg-slate-200/60'}`}>
                    <MapPin className={`w-5 h-5 transition-colors duration-300 ${isPickup ? 'text-primary' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-700 block">Free Pickup & Drop</span>
                    <span className="text-xs text-slate-400">We'll pick up & deliver your bike</span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isPickup}
                    onChange={(e) => {
                      setIsPickup(e.target.checked);
                      if (!e.target.checked) setErrors(prev => ({ ...prev, address: '' }));
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-slate-200 rounded-full peer-checked:bg-primary transition-colors duration-300" />
                  <div className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform duration-300" />
                </div>
              </label>

              {isPickup && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Pickup Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => { setAddress(e.target.value); setErrors(prev => ({ ...prev, address: '' })); }}
                      placeholder="Enter your pickup address"
                      className={`input-premium !pl-14 ${errors.address ? '!border-red-500' : ''}`}
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.address}</p>}
                </div>
              )}

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
                      setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    placeholder="Enter 10-digit number"
                    className={`input-premium !pl-16 ${errors.phone ? '!border-red-500' : ''}`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.phone}</p>}
              </div>

              <Button type="submit" fullWidth className="btn-primary py-5 text-xl shadow-primary/20">
                {isPickup ? 'Get Free Pickup' : 'Book Service'}
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
