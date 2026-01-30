'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { siteConfig } from '@/lib/config/site';

export const FloatingButtons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const whatsappLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=Hi! I want to book a bike service.`;

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
        {/* Call Button */}
        <a
          href={`tel:${siteConfig.contact.phone}`}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 bg-blue-600 hover:bg-blue-700"
          aria-label="Call us"
          title="Call us"
        >
          <Phone className="w-6 h-6" />
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 bg-[#25D366] hover:bg-[#128C7E] animate-pulse-scale"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 left-8 z-[100] w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-premium hover:bg-slate-900 hover:text-white transition-all duration-300 ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </>
  );
};
