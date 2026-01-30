/**
 * Centrally managed environment variables.
 * Using this approach ensures type safety and provides a single place for all config.
 * 
 * NEXT_PUBLIC_ variables are available on both client and server side.
 * Other variables are only available on the server side.
 */

const config = {
    // App URLs
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",

    // Database (Server-side only)
    MONGODB_URI: process.env.MONGODB_URI || "",

    // Identity / Auth (Server-side only)
    JWT_SECRET: process.env.JWT_SECRET || "",

    // Environment mode
    NODE_ENV: process.env.NODE_ENV || "development",
    IS_DEV: process.env.NODE_ENV === "development",
    IS_PROD: process.env.NODE_ENV === "production",

    // Theme Configuration
    THEME: process.env.NEXT_THEME || "red-black",

    // Site Configuration
    SITE_URL: process.env.NEXT_SITE_URL || "https://www.roadromeo.in",
    SITE_NAME: process.env.NEXT_SITE_NAME || "Road Romeo Services",

    // Contact Information
    PHONE: process.env.NEXT_PHONE || "",
    WHATSAPP: process.env.NEXT_WHATSAPP || "",
    EMAIL: process.env.NEXT_EMAIL || "",

    // Google Services
    GA_ID: process.env.NEXT_GA_ID || "",
    GOOGLE_MAPS_KEY: process.env.NEXT_GOOGLE_MAPS_KEY || "",

    // Elfsight Widget
    ELFSIGHT_WIDGET_ID: process.env.NEXT_ELFSIGHT_WIDGET_ID || "",

    // Social Media
    FACEBOOK_URL: process.env.NEXT_FACEBOOK_URL || "",
    INSTAGRAM_URL: process.env.NEXT_INSTAGRAM_URL || "",
} as const;


// # App configuration
// NEXT_PUBLIC_APP_URL=http://localhost:3000
// NEXT_PUBLIC_API_URL=http://localhost:3000/api

// # Database
// MONGODB_URI=your_mongodb_uri_here

// # Auth
// JWT_SECRET=your_jwt_secret_here

// # Theme Configuration
// # Options: 'orange-blue' (default) or 'red-black'
// NEXT_THEME=red-black

// # Site Configuration
// NEXT_SITE_URL=https://www.roadromeo.in
// NEXT_SITE_NAME=Road Romeo Services

// # Contact Information
// NEXT_PHONE=9730963184
// NEXT_WHATSAPP=919730963184
// NEXT_EMAIL=contact@roadromeo.in

// # Google Services
// NEXT_GA_ID=G-XXXXXXXXXX
// NEXT_GOOGLE_MAPS_KEY=your_maps_api_key

// # Elfsight Widget
// # Get your widget ID from https://elfsight.com/
// NEXT_ELFSIGHT_WIDGET_ID=YOUR_ELFSIGHT_WIDGET_ID

// # Social Media
// NEXT_FACEBOOK_URL=https://facebook.com/roadromeoservices
// NEXT_INSTAGRAM_URL=https://instagram.com/roadromeo
export default config;
