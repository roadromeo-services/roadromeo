import { Star, Users, Shield, Truck } from 'lucide-react';
import { siteConfig } from '@/config/site';

const badges = [
  {
    icon: Star,
    value: siteConfig.stats.rating.toString(),
    label: 'Google Rating',
    sublabel: `${siteConfig.stats.reviewCount}+ reviews`,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50'
  },
  {
    icon: Users,
    value: siteConfig.stats.customersServed,
    label: 'Happy Customers',
    sublabel: 'Across Pune',
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    icon: Shield,
    value: `${siteConfig.stats.warrantyDays} Days`,
    label: 'Service Warranty',
    sublabel: 'On all repairs',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  },
  {
    icon: Truck,
    value: 'FREE',
    label: 'Pickup & Drop',
    sublabel: 'Standard City-wide',
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
];

export const TrustBadges = () => {
  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              <div className={`w-20 h-20 ${badge.bg} rounded-[2rem] flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110 shadow-sm`}>
                <badge.icon className={`w-10 h-10 ${badge.color}`} />
              </div>
              <p className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tighter">{badge.value}</p>
              <p className="font-bold text-slate-900 text-lg uppercase tracking-wider">{badge.label}</p>
              <p className="text-sm font-medium text-slate-400 mt-2">{badge.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
