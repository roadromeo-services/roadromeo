import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/common';
import { siteConfig } from '@/lib/config/site';

export const CTASection = () => {
  const whatsappLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=Hi! I want to book a bike service.`;

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-primary">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Give Your Bike the Care It Deserves?
          </h2>

          <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
            Book your service today and experience the Road Romeo difference.
            Free pickup, expert service, and your bike returned better than ever!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link href="/contact">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Book Service Now
              </Button>
            </Link>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </a>

            <a href={`tel:${siteConfig.contact.phone}`}>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
