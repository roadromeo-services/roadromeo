"use client";
import { useEffect } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/lib/config/site';

export const Reviews = () => {
  useEffect(() => {
    // Load Elfsight script
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Customer Reviews
            </h1>
            <p className="text-lg text-text-secondary mb-6">
              See what our customers have to say about their experience with Road Romeo.
            </p>

            {/* Rating Summary */}
            <div className="inline-flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-md">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${i < Math.round(siteConfig.stats.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-text-primary">
                {siteConfig.stats.rating}
              </span>
              <span className="text-text-secondary">
                ({siteConfig.stats.reviewCount}+ reviews)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Widget */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            {/* Elfsight Google Reviews Widget */}
            <div
              className="elfsight-app-lazy"
              data-elfsight-app-lazy
              data-elfsight-app-id={siteConfig.elfsightWidgetId}
            />
          </div>

          {/* Leave Review CTA */}
          <div className="text-center mt-12">
            <p className="text-text-secondary mb-4">
              Had a great experience? We'd love to hear from you!
            </p>
            <a
              href="https://g.page/r/YOUR_REVIEW_LINK/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Leave Us a Review
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
