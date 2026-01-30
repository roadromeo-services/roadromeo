import { Phone, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const FloatingButtons = () => {
  const whatsappLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=Hi! I want to book a bike service.`;

  return (
    <div className="floating-buttons">
      {/* Call Button */}
      <a
        href={`tel:${siteConfig.contact.phone}`}
        className="call-btn"
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
        className="whatsapp-btn animate-pulse-scale"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};
