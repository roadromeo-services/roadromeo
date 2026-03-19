'use client';

import { usePathname } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { FloatingButtons } from '@/components/widgets/FloatingButtons';

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main className="flex-1 pt-24 lg:pt-32">
                {children}
            </main>
            <Footer />
            <FloatingButtons />
        </>
    );
}
