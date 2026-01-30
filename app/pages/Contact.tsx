'use client';
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button, Input, Select } from '@/components/common';
import { siteConfig } from '@/config/site';
import { bikeBrands, getModelsByBrand } from '@/lib/data/bikes';
import { services } from '@/lib/data/services';

export const Contact = () => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const brandOptions = bikeBrands.map(brand => ({
    value: brand.id,
    label: brand.name,
  }));

  const modelOptions = selectedBrand
    ? getModelsByBrand(selectedBrand).map(model => ({
      value: model,
      label: model,
    }))
    : [];

  const serviceOptions = services.map(service => ({
    value: service.id,
    label: service.name,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `Hi! I want to book a service.\n\nName: ${name}\nPhone: ${phone}\nBike: ${selectedBrand} ${selectedModel}\nService: ${selectedService}\nMessage: ${message}`;
    const whatsappLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <>
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-text-secondary">
              Get in touch with us for bookings, queries, or feedback.
              We're here to help!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Book Your Service
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-text-secondary">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your number"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Bike Brand"
                    options={brandOptions}
                    placeholder="Select Brand"
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setSelectedModel('');
                    }}
                    required
                  />
                  <Select
                    label="Bike Model"
                    options={modelOptions}
                    placeholder="Select Model"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={!selectedBrand}
                    required
                  />
                </div>

                <Select
                  label="Service Required"
                  options={serviceOptions}
                  placeholder="Select Service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any specific requirements or issues..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <Button type="submit" fullWidth size="lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Send via WhatsApp
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Phone</h3>
                    <a
                      href={`tel:${siteConfig.contact.phone}`}
                      className="text-primary hover:underline text-lg"
                    >
                      +91 {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">WhatsApp</h3>
                    <a
                      href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-lg"
                    >
                      +91 {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Email</h3>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-primary hover:underline"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Location</h3>
                    <p className="text-text-secondary">{siteConfig.contact.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Business Hours</h3>
                    <p className="text-text-secondary">
                      Mon - Sat: {siteConfig.businessHours.weekdays}
                    </p>
                    <p className="text-text-secondary">
                      Sunday: {siteConfig.businessHours.sunday}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 p-6 bg-bg-secondary rounded-xl">
                <h3 className="font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <a href={`tel:${siteConfig.contact.phone}`}>
                    <Button variant="secondary" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-[#25D366] hover:bg-[#128C7E]">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
