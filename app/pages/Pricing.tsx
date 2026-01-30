import { CheckCircle } from 'lucide-react';
import { Card, Badge, Button } from '@/components/common';
import { pricingPackages } from '@/lib/data/pricing';
import { siteConfig } from '@/lib/config/site';

export const Pricing = () => {
  const whatsappLink = (packageName: string) =>
    `https://wa.me/${siteConfig.contact.whatsapp}?text=Hi! I want to book the ${packageName} package.`;

  return (
    <>
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-text-secondary">
              Choose the service package that best fits your bike's needs.
              No hidden charges, ever.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative flex flex-col ${pkg.popular ? 'ring-2 ring-accent shadow-xl scale-105' : ''
                  }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="accent">{pkg.badge}</Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    {pkg.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-accent">₹{pkg.price}</span>
                    <span className="text-text-secondary">/service</span>
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a href={whatsappLink(pkg.name)} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant={pkg.popular ? 'primary' : 'outline'}
                    fullWidth
                    size="lg"
                  >
                    Book Now
                  </Button>
                </a>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-text-secondary mb-4">
              All packages include <strong>FREE pickup & drop</strong> and{' '}
              <strong>10-day warranty</strong>
            </p>
            <p className="text-text-secondary">
              Need a custom service?{' '}
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="text-primary font-semibold hover:underline"
              >
                Call us
              </a>{' '}
              for a personalized quote.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
