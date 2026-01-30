export const siteConfig = {
  name: 'Road Romeo Services',
  tagline: 'Best Bike Service in Pune',
  description: 'Two-wheeler servicing & repair in Pune with FREE pickup & drop. Oil change, repairs, ceramic coating & more.',
  url: 'https://www.roadromeo.in',

  contact: {
    phone: '9730963184',
    whatsapp: '919730963184',
    email: 'contact@roadromeo.in',
    address: 'Pune, Maharashtra, India',
  },

  social: {
    facebook: 'https://facebook.com/roadromeoservices',
    instagram: 'https://instagram.com/roadromeo',
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

  // Elfsight Widget ID - Replace with your actual widget ID from Elfsight
  elfsightWidgetId: 'YOUR_ELFSIGHT_WIDGET_ID',
};

export type SiteConfig = typeof siteConfig;
