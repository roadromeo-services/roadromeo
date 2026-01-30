import { Target, Eye, Users, Award } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const About = () => {
  return (
    <>
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              About Road Romeo
            </h1>
            <p className="text-lg text-text-secondary">
              Your trusted partner for two-wheeler care in Pune since day one.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text-primary mb-6">Our Story</h2>
            <div className="prose prose-lg text-text-secondary">
              <p>
                Road Romeo Services was born out of a simple frustration - the hassle of
                taking your bike to a service center, waiting for hours, and never being
                sure about the quality of work done.
              </p>
              <p>
                We thought: "What if bike servicing could be as convenient as ordering food?"
                And that's exactly what we built. A service where your bike gets picked up
                from your doorstep, serviced by expert mechanics, and delivered back to you
                in perfect condition.
              </p>
              <p>
                Today, we're proud to have served over {siteConfig.stats.customersServed} happy
                customers across Pune, maintaining a stellar {siteConfig.stats.rating}-star
                rating on Google.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20 bg-bg-secondary">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">Our Mission</h3>
              <p className="text-text-secondary">
                To make bike maintenance hassle-free, affordable, and accessible to every
                rider in Pune. We believe that a well-maintained bike is a safer bike,
                and everyone deserves quality service at their doorstep.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">Our Vision</h3>
              <p className="text-text-secondary">
                To become the most trusted name in two-wheeler care across India. We envision
                a future where every bike owner has access to transparent, convenient, and
                high-quality servicing - no matter where they are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-heading">Our Values</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Users,
                title: 'Customer First',
                description: 'Every decision we make starts with "How does this benefit our customers?"',
              },
              {
                icon: Award,
                title: 'Quality Always',
                description: 'We never compromise on parts, service, or workmanship. Period.',
              },
              {
                icon: Target,
                title: 'Transparency',
                description: 'No hidden charges, no surprise bills. What we quote is what you pay.',
              },
              {
                icon: Eye,
                title: 'Convenience',
                description: 'Your time is valuable. We bring the service to you, not the other way around.',
              },
            ].map((value, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{value.title}</h3>
                <p className="text-text-secondary text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
