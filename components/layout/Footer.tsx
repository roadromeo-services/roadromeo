'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { siteConfig } from '@/lib/config/site';
import { areasServed } from '@/lib/data/areas';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-24 pb-12 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
                <span className="text-white font-black text-2xl">RR</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white leading-none tracking-tight">Road Romeo</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] leading-none mt-1.5">Premium Services</span>
              </div>
            </div>

            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-md">
              {siteConfig.description}
            </p>

            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
              <h4 className="text-white font-bold mb-2">Subscribe to our newsletter</h4>
              <p className="text-sm text-slate-500 mb-6">Receive maintenance tips and exclusive offers.</p>
              <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button className="bg-primary text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all">
                  <Mail className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Quick Links</h4>
              <ul className="space-y-4">
                {['Services', 'Pricing', 'About', 'Reviews', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-slate-400 hover:text-primary transition-colors flex items-center group"
                    >
                      <span className="w-0 group-hover:w-4 h-[2px] bg-primary mr-0 group-hover:mr-2 transition-all duration-300" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Contact Info</h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 group hover:bg-primary/20 transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Call Support</span>
                    <a href={`tel:${siteConfig.contact.phone}`} className="text-white font-bold hover:text-primary transition-colors">
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Our Location</span>
                    <span className="text-slate-400 text-sm leading-relaxed">
                      {siteConfig.contact.address}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Areas Served</h4>
              <div className="flex flex-wrap gap-2">
                {areasServed.slice(0, 15).map((area) => (
                  <span
                    key={area}
                    className="text-[10px] font-bold px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 text-slate-400 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all cursor-default"
                  >
                    {area}
                  </span>
                ))}
                <span className="text-[10px] font-bold px-3 py-1.5 text-primary">+{areasServed.length - 15} more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-10">
            <p className="text-sm text-slate-500">
              &copy; {currentYear} {siteConfig.name}. All rights reserved.
            </p>
            <div className="hidden md:flex gap-6">
              <Link href="/privacy-policy" className="text-xs font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Privacy</Link>
              <Link href="/terms-of-service" className="text-xs font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Terms</Link>
            </div>
          </div>

          <div className="flex gap-4">
            {[
              { icon: Facebook, href: siteConfig.social.facebook, label: 'Facebook' },
              { icon: Instagram, href: siteConfig.social.instagram, label: 'Instagram' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
