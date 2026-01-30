import { useEffect } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const GoogleReviews = () => {
  useEffect(() => {
    // Load Elfsight script
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
      const existingScript = document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading">What Our Customers Say</h2>
          <p className="section-subheading">
            Don't just take our word for it. See what our happy customers
            have to say about their experience with Road Romeo.
          </p>

          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-7 h-7 ${i < Math.round(siteConfig.stats.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="text-3xl font-bold text-text-primary">
              {siteConfig.stats.rating}
            </span>
            <span className="text-lg text-text-secondary">
              ({siteConfig.stats.reviewCount}+ reviews)
            </span>
          </div>

          <a
            href="https://g.page/r/YOUR_REVIEW_LINK/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline mt-4 text-lg"
          >
            Leave us a review on Google
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        {/* Elfsight Google Reviews Widget */}
        <div className="max-w-5xl mx-auto">
          {/* Replace YOUR_ELFSIGHT_WIDGET_ID with your actual Elfsight widget ID */}
          <div
            className="elfsight-app-lazy"
            data-elfsight-app-lazy
            data-elfsight-app-id={siteConfig.elfsightWidgetId}
          />

          {/* Fallback if widget doesn't load */}
          <noscript>
            <div className="text-center py-8 bg-bg-secondary rounded-lg">
              <p className="text-text-secondary">
                Please enable JavaScript to see our Google Reviews.
              </p>
              <a
                href="https://www.google.com/search?q=road+romeo+services+pune+reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View our reviews on Google
              </a>
            </div>
          </noscript>
        </div>
      </div>
    </section>
  );
};
