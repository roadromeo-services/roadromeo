import { Truck, Shield, Clock, Wrench, BadgeCheck, Wallet } from 'lucide-react';

const reasons = [
  {
    icon: Truck,
    title: 'Free Pickup & Drop',
    description: 'We pick up your bike from your doorstep and deliver it back after service - completely free!',
  },
  {
    icon: Shield,
    title: '10-Day Warranty',
    description: 'All our services come with a 10-day unconditional warranty for your peace of mind.',
  },
  {
    icon: Clock,
    title: 'Quick Turnaround',
    description: 'Most services completed within 24 hours. Get back on the road faster!',
  },
  {
    icon: Wrench,
    title: 'Expert Mechanics',
    description: 'Our trained technicians have years of experience with all bike brands.',
  },
  {
    icon: BadgeCheck,
    title: 'Genuine Parts',
    description: 'We use only genuine OEM or equivalent quality spare parts for all repairs.',
  },
  {
    icon: Wallet,
    title: 'Transparent Pricing',
    description: 'No hidden charges. Get detailed quotes before any work begins.',
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-white relative">
      <div className="container relative z-10">
        <div className="text-center mb-24">
          <span className="badge-premium">The Advantage</span>
          <h2 className="section-heading">Why Riders Trust Us</h2>
          <p className="section-subheading">
            We're not just another bike service center. We've redesigned the mechanics
            experience for the modern world.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {reasons.map((reason, index) => (
            <div key={index} className="card-premium flex flex-col group border-none bg-slate-50/50 hover:bg-white transition-all duration-500">
              <div className="w-20 h-20 bg-white shadow-xl shadow-slate-200/50 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                <reason.icon className="w-10 h-10 text-primary" />
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                {reason.title}
              </h3>

              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Circle decoration */}
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-float" />
    </section>
  );
};
