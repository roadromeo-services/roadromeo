'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { siteConfig } from '@/lib/config/site';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'
        }`}
    >
      <div className="container">
        <div
          className={`flex items-center justify-between px-8 rounded-[2rem] transition-all duration-500 ${scrolled
            ? 'glass shadow-xl py-3 border-slate-200/50'
            : 'bg-transparent py-4 border-transparent'
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <span className="text-white font-black text-xl">RR</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 leading-none">Road Romeo</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] leading-none mt-1">Services</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                  ${isActive(link.href)
                    ? 'text-primary bg-primary/5'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="flex items-center gap-3 text-slate-900 group"
            >
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-success fill-success/20" />
              </div>
              <span className="font-bold text-sm">{siteConfig.contact.phone}</span>
            </a>
            <Link href="/contact">
              <button className="bg-slate-900 text-white px-7 py-3 rounded-2xl font-black text-sm hover:bg-primary hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200">
                Book Now
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 bg-slate-100 rounded-xl text-slate-900 hover:bg-slate-200 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 animate-fade-in">
            <div className="glass rounded-[2.5rem] p-8 shadow-2xl border-slate-200">
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      text-lg font-bold p-4 rounded-2xl transition-all
                      ${isActive(link.href)
                        ? 'text-primary bg-primary/5'
                        : 'text-slate-600 hover:bg-slate-50'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-4">
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl"
                  >
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Call Support</p>
                      <p className="font-black text-slate-900">{siteConfig.contact.phone}</p>
                    </div>
                  </a>
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all">
                      Book Service Now
                    </button>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
];
