import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge, Button } from '@/components/common';
import { services } from '@/data/services';

export const ServicesGrid = () => {
  return (
    <section className="section-padding bg-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-3xl">
            <span className="badge-premium">Expertise</span>
            <h2 className="section-heading !text-left mb-6">Our Services</h2>
            <p className="text-xl text-slate-500 leading-relaxed">
              From basic maintenance to premium detailing, we offer comprehensive
              two-wheeler services with quality you can trust.
            </p>
          </div>
          <Link href="/services" className="hidden md:block">
            <Button variant="outline" size="lg" className="rounded-2xl">
              View All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => (
            <div key={service.id} className="card-premium flex flex-col group">
              <div className="flex items-start justify-between mb-8">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                  <service.icon className="w-10 h-10 transition-transform duration-500 group-hover:scale-110" />
                </div>
                {service.popular && (
                  <Badge className="bg-primary/10 text-primary border-none font-bold py-1.5 px-4 rounded-full">
                    Popular
                  </Badge>
                )}
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">
                {service.name}
              </h3>

              <p className="text-lg text-slate-500 mb-10 flex-1 leading-relaxed">
                {service.shortDescription}
              </p>

              <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Starting at</span>
                  <p className="text-3xl font-black text-slate-900 italic">₹{service.price}</p>
                </div>

                <Link href={`/services/${service.slug}`}>
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-primary hover:scale-110 transition-all cursor-pointer shadow-lg shadow-slate-200">
                    <ArrowRight className="w-7 h-7" />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 md:hidden">
          <Link href="/services">
            <Button variant="outline" size="lg" className="w-full rounded-2xl">
              View All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
