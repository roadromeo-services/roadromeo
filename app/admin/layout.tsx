'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Wrench,
    Tag,
    Bike,
    LogOut,
    Menu,
    X,
    User,
    ClipboardList,
    Receipt
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated' && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [status, router, pathname]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Hide admin UI on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!session) return null;

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Bookings', href: '/admin/bookings', icon: ClipboardList },
        { name: 'Billing', href: '/admin/billing', icon: Receipt },
        { name: 'Services', href: '/admin/services', icon: Wrench },
        { name: 'Pricing', href: '/admin/pricing', icon: Tag },
        { name: 'Bikes', href: '/admin/bikes', icon: Bike },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 flex">
            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-zinc-200 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-white">RR</div>
                        <span className="text-xl font-black">ADMIN <span className="text-red-600">PANEL</span></span>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}
                  `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all mt-auto"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-auto">
                <header className="h-20 border-b border-zinc-200 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
                    <button className="lg:hidden" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-zinc-900">{session.user?.email}</p>
                            <p className="text-xs text-zinc-400 capitalize">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-zinc-500" />
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
