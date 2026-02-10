import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { FloatingButtons } from "@/components/widgets/FloatingButtons";
import AuthProvider from "@/components/providers/AuthProvider";
import { DataProvider } from "@/components/providers/DataProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.roadromeo.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Road Romeo - Best Bike Service in Pune | FREE Pickup & Drop",
    template: "%s | Road Romeo",
  },
  description:
    "Professional two-wheeler servicing & repair in Pune. Oil change, engine repair, ceramic coating, diagnostics & more with FREE pickup & drop. 4.8★ rated, 5000+ happy customers.",
  keywords: [
    "bike service pune",
    "two wheeler service pune",
    "bike repair pune",
    "scooter service pune",
    "oil change bike pune",
    "ceramic coating bike pune",
    "bike mechanic pune",
    "doorstep bike service pune",
    "bike service near me",
    "road romeo",
    "road romeo services",
    "bike pickup drop service pune",
  ],
  authors: [{ name: "Road Romeo Services" }],
  creator: "Road Romeo Services",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Road Romeo Services",
    title: "Road Romeo - Best Bike Service in Pune | FREE Pickup & Drop",
    description:
      "Professional two-wheeler servicing & repair in Pune. Oil change, engine repair, ceramic coating & more with FREE pickup & drop. 4.8★ rated.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Road Romeo - Best Bike Service in Pune",
    description:
      "Professional two-wheeler servicing & repair in Pune with FREE pickup & drop. 4.8★ rated, 5000+ happy customers.",
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

// JSON-LD structured data for LocalBusiness
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Road Romeo Services",
  description:
    "Professional two-wheeler servicing & repair in Pune with FREE pickup & drop.",
  url: siteUrl,
  telephone: "+918235213130",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "18.5204",
    longitude: "73.8567",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "500",
    bestRating: "5",
  },
  priceRange: "₹₹",
  areaServed: {
    "@type": "City",
    name: "Pune",
  },
  serviceType: [
    "Bike Service",
    "Scooter Service",
    "Oil Change",
    "Engine Repair",
    "Ceramic Coating",
    "Bike Diagnostics",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <DataProvider>
            <Header />
            <main className="flex-1 pt-24 lg:pt-32">
              {children}
            </main>
            <Footer />
            <FloatingButtons />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
