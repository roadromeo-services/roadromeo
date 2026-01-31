'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { Button, Card } from '@/components/common';
import { siteConfig } from '@/lib/config/site';
import { getIcon } from '@/lib/icons';
import { useState } from 'react';

import { useData } from '@/components/providers/DataProvider';

export const ServiceDetail = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { services, loading } = useData();

  const service = slug ? services.find(s => s.slug === slug) : null;

  useEffect(() => {
    if (!loading && !service) {
      router.replace('/services');
    }
  }, [service, router, loading]);

  if (loading || !service) return null;

  const Icon = getIcon(service.icon);
  const whatsappLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=Hi! I want to book ${service.name} for my bike.`;
  const otherServices = services.filter(s => s._id !== service._id).slice(0, 3);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-bg-secondary py-4">
        <div className="container">
          <Link href="/services" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
      </div>

      {/* Service Detail */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                    {service.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-text-secondary">
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </span>
                    <span className="text-2xl font-bold text-accent">
                      ₹{service.price}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-text-secondary mb-8">
                {service.description}
              </p>

              <div className="bg-bg-secondary rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-text-primary mb-4">
                  What's Included
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-text-primary">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-6">
                <h2 className="text-xl font-bold text-text-primary mb-4">
                  Why Choose This Service?
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-text-secondary">Free pickup and drop at your doorstep</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-text-secondary">10-day service warranty included</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-text-secondary">Genuine parts and expert mechanics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-text-secondary">Transparent pricing with no hidden charges</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  Book This Service
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-text-secondary">Service</span>
                    <span className="font-semibold text-text-primary">{service.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-text-secondary">Duration</span>
                    <span className="font-semibold text-text-primary">{service.duration}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-text-secondary">Starting Price</span>
                    <span className="font-bold text-accent text-xl">₹{service.price}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                    <Button fullWidth size="lg">
                      Book on WhatsApp
                    </Button>
                  </a>
                  <a href={`tel:${siteConfig.contact.phone}`} className="block">
                    <Button variant="outline" fullWidth>
                      Call to Book
                    </Button>
                  </a>
                </div>

                <p className="text-center text-sm text-text-secondary mt-4">
                  Free pickup & drop included
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-12 bg-bg-secondary">
        <div className="container">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Other Services You Might Like
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {otherServices.map((s: any) => (
              <Link key={s._id} href={`/services/${s.slug}`}>
                <Card className="h-full hover:border-primary transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    {(() => {
                      const OtherIcon = getIcon(s.icon);
                      return <OtherIcon className="w-6 h-6 text-primary" />;
                    })()}
                  </div>
                  <h3 className="font-bold text-text-primary mb-2">{s.name}</h3>
                  <p className="text-sm text-text-secondary mb-3">{s.shortDescription}</p>
                  <p className="font-bold text-accent">From ₹{s.price}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
