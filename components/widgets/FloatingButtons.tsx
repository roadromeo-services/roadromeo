import config from '@/lib/config';
import { Phone, MessageCircle } from 'lucide-react';


export const FloatingButtons = () => {
  const whatsappLink = `https://wa.me/${config.WHATSAPP}?text=Hi! I want to book a bike service.`;

  return (
    <div className="floating-buttons">
      {/* Call Button */}
      <a
        href={`tel:${config.PHONE}`}
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
