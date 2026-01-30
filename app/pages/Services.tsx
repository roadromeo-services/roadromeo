import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, Badge, Button } from '@/components/common';
import { services } from '@/lib/data/services';

export const Services = () => {
  return (
    <>
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Our Services
            </h1>
            <p className="text-lg text-text-secondary">
              Comprehensive two-wheeler services for all major brands.
              From routine maintenance to premium detailing.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  {service.popular && (
                    <Badge variant="accent">Popular</Badge>
                  )}
                </div>

                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {service.name}
                </h3>

                <p className="text-text-secondary mb-4">
                  {service.description}
                </p>

                <div className="mb-4">
                  <p className="text-sm font-medium text-text-primary mb-2">Includes:</p>
                  <ul className="space-y-1">
                    {service.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="text-sm text-text-secondary flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                    {service.features.length > 4 && (
                      <li className="text-sm text-primary">
                        +{service.features.length - 4} more
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t mt-auto">
                  <div>
                    <span className="text-sm text-text-secondary">Starting at</span>
                    <p className="text-2xl font-bold text-accent">₹{service.price}</p>
                    <span className="text-xs text-text-secondary">{service.duration}</span>
                  </div>

                  <Link href={`/services/${service.slug}`}>
                    <Button variant="primary" size="sm">
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
