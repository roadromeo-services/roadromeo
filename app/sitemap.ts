import type { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.roadromeo.in';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
        { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${siteUrl}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${siteUrl}/reviews`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    ];

    // Dynamic service pages
    let servicePages: MetadataRoute.Sitemap = [];
    try {
        await dbConnect();
        const services = await Service.find({}, 'slug updatedAt').lean();
        servicePages = services.map((service: any) => ({
            url: `${siteUrl}/services/${service.slug}`,
            lastModified: service.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch {
        // If DB is unavailable, return static pages only
    }

    return [...staticPages, ...servicePages];
}
