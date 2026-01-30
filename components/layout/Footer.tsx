import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { areasServed } from '@/lib/data/areas';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-dark text-text-light mt-auto">
      <div className="container section-padding-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl font-bold text-white">Road</span>
              <span className="text-3xl font-bold text-accent">Romeo</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex gap-5">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-300 hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-0.5" />
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-0.5" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <span className="text-gray-300">{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent mt-0.5" />
                <div className="text-gray-300">
                  <p>Mon-Sat: {siteConfig.businessHours.weekdays}</p>
                  <p>Sun: {siteConfig.businessHours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Areas Served */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Areas We Serve</h4>
            <div className="flex flex-wrap gap-2.5">
              {areasServed.slice(0, 12).map((area) => (
                <span
                  key={area}
                  className="text-sm text-gray-300 bg-white/10 px-3 py-1.5 rounded-lg"
                >
                  {area}
                </span>
              ))}
              {areasServed.length > 12 && (
                <span className="text-sm text-accent font-medium">
                  +{areasServed.length - 12} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-base">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-8 text-base">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
