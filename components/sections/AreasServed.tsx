import { MapPin } from 'lucide-react';
import { areasServed } from '@/data/areas';

export const AreasServed = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white">
      <div className="container">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="section-heading">Areas We Serve in Pune</h2>
          <p className="section-subheading">
            Free pickup and drop available across all major areas in Pune city.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {areasServed.map((area) => (
            <div
              key={area}
              className="inline-flex items-center gap-2 bg-bg-secondary px-5 py-3 rounded-full hover:bg-primary/10 transition-colors duration-200"
            >
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-text-primary font-medium text-base">{area}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-text-secondary mt-12 text-lg">
          Don't see your area? No worries!{' '}
          <a href={`tel:9730963184`} className="text-primary font-semibold hover:underline">
            Call us
          </a>{' '}
          and we'll arrange pickup from your location.
        </p>
      </div>
    </section>
  );
};
