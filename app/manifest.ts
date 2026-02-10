import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Road Romeo - Premium Bike Services',
        short_name: 'Road Romeo',
        description: 'Two-wheeler servicing & repair in Pune with FREE pickup & drop. Oil change, repairs, ceramic coating & more.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#dc2626',
        icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
    };
}
