import { Phone, Calendar, Wrench, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Phone,
    title: 'Book Online',
    description: 'Fill the form or WhatsApp us. It takes less than 60 seconds.',
  },
  {
    icon: Calendar,
    title: 'Schedule Pickup',
    description: 'We come to your location at your preferred time slot.',
  },
  {
    icon: Wrench,
    title: 'Expert Service',
    description: 'Genuine parts and multi-point inspection by certified pros.',
  },
  {
    icon: CheckCircle,
    title: 'Free Delivery',
    description: 'Get your bike back, shinier and smoother than ever.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="section-padding bg-slate-50 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center mb-24">
          <span className="badge-premium">The Process</span>
          <h2 className="section-heading tracking-tighter">Your Journey with Us</h2>
          <p className="section-subheading">
            We've simplified bike maintenance into four effortless steps.
            No more waiting at workshops.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Global Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-slate-200 dashed" />

          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Step Number Circle */}
              <div className="relative inline-flex items-center justify-center w-32 h-32 bg-white rounded-[2.5rem] mb-10 shadow-xl shadow-slate-200/50 group-hover:bg-slate-900 group-hover:-translate-y-2 transition-all duration-500">
                <step.icon className="w-12 h-12 text-primary group-hover:text-white transition-colors" />

                {/* Step Number Badge */}
                <span className="absolute -top-3 -right-3 w-12 h-12 bg-primary text-white text-xl font-black rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
                  {index + 1}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-4 px-2">
                {step.title}
              </h3>

              <p className="text-lg text-slate-500 leading-relaxed font-medium px-4">
                {step.description}
              </p>

              {/* Mobile Arrows */}
              {index < steps.length - 1 && (
                <div className="lg:hidden mt-8 flex justify-center">
                  <div className="w-0.5 h-12 bg-slate-200" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Decorative SVG Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </section>
  );
};
