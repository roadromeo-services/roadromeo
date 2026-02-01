"use client";

import { useEffect } from "react";
import { Star, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config/site";

export const GoogleReviews = () => {
  useEffect(() => {
    // Load Elfsight only once
    if (
      document.querySelector(
        'script[src="https://static.elfsight.com/platform/platform.js"]'
      )
    ) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.defer = true;
    document.body.appendChild(script);
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
            {/* <div className="inline-flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-md">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.round(siteConfig.stats.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
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
            </div> */}
          </div>
        </div>
      </section>

      {/* Reviews Widget */}
      <section className="py-2 md:py-20">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            {/* ✅ Correct Elfsight container */}
            <div
              className={`${siteConfig.elfsightWidgetId}`}
              data-elfsight-app-lazy
            />
          </div>

          {/* Leave Review CTA */}
          <div className="text-center mt-12">
            <p className="text-text-secondary mb-4">
              Had a great experience? We'd love to hear from you!
            </p>

            <a
              href="https://www.google.com/maps/place/ROAD+ROMEO+SERVICES+(Singh+Automobiles)+Bike+%26+Scooter+Service+Center+Baner+Balewadi/@18.5807901,73.7679019,17z/data=!4m8!3m7!1s0x3bc2b9accae93d57:0x44cd134d1be33ff9!8m2!3d18.580785!4d73.7704822!9m1!1b1!16s%2Fg%2F11g0hyc6jk?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoASAFQAw%3D%3D"
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
