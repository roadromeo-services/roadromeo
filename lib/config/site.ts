export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Road Romeo Services',
  tagline: 'Best Bike Service in Pune',
  description:
    'Two-wheeler servicing & repair in Pune with FREE pickup & drop. Oil change, repairs, ceramic coating & more.',
  url: process.env.NEXT_PUBLIC_SITE_URL,

  theme: process.env.NEXT_PUBLIC_THEME || 'orange-blue',

  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE,
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP,
    email: process.env.NEXT_PUBLIC_EMAIL,
    address: process.env.NEXT_PUBLIC_ADDRESS,
  },

  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  },

  businessHours: {
    weekdays: '9:00 AM - 7:00 PM',
    saturday: '9:00 AM - 7:00 PM',
    sunday: 'Closed',
  },

  stats: {
    rating: 4.8,
    reviewCount: 500,
    customersServed: '5000+',
    warrantyDays: 10,
  },

  elfsightWidgetId: process.env.NEXT_PUBLIC_ELFSIGHT_WIDGET_ID,
};

export type SiteConfig = typeof siteConfig;
