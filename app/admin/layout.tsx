'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
    Receipt,
    Package,
    Bell
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated' && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [status, router, pathname]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!session) return null;

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Bookings', href: '/admin/bookings', icon: ClipboardList },
        { name: 'Billing', href: '/admin/billing', icon: Receipt },
        { name: 'Inventory', href: '/admin/inventory', icon: Package },
        { name: 'Services', href: '/admin/services', icon: Wrench },
        { name: 'Pricing', href: '/admin/pricing', icon: Tag },
        { name: 'Bikes', href: '/admin/bikes', icon: Bike },
        { name: 'Alerts', href: '/admin/alerts', icon: Bell },
    ];

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-200 flex-col">
                <div className="h-full flex flex-col p-5">
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-sm">RR</div>
                        <span className="text-lg font-black">ADMIN <span className="text-red-600">PANEL</span></span>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm
                                        ${active
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
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all mt-auto text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-[60]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-200">
                        <div className="h-full flex flex-col p-5">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-sm">RR</div>
                                    <span className="text-lg font-black">ADMIN <span className="text-red-600">PANEL</span></span>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-zinc-100 rounded-xl">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                                ${active
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

                            <div className="border-t border-zinc-100 pt-4 mt-4">
                                <div className="flex items-center gap-3 px-4 py-2 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                                        <User className="w-4 h-4 text-zinc-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-zinc-900 truncate">{session.user?.email}</p>
                                        <p className="text-xs text-zinc-400">Administrator</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all w-full"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-auto lg:ml-64">
                {/* Top Header */}
                <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
                    {/* Desktop header */}
                    <div className="hidden lg:flex h-16 items-center justify-between px-8">
                        <div className="flex items-center gap-3 ml-auto">
                            <div className="text-right">
                                <p className="text-sm font-bold text-zinc-900">{session.user?.email}</p>
                                <p className="text-xs text-zinc-400 capitalize">Administrator</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                                <User className="w-4 h-4 text-zinc-500" />
                            </div>
                        </div>
                    </div>

                    {/* Mobile header with nav */}
                    <div className="lg:hidden">
                        <div className="flex items-center justify-between px-4 h-12">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-[10px]">RR</div>
                                <span className="text-sm font-black">Admin</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                                <User className="w-3.5 h-3.5 text-zinc-500" />
                            </div>
                        </div>
                        {/* Scrollable nav tabs */}
                        <div className="flex overflow-x-auto gap-1 px-3 pb-2 scrollbar-hide">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                                            active
                                                ? 'bg-red-600 text-white'
                                                : 'text-zinc-500 hover:bg-zinc-100'
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap text-zinc-400 hover:text-red-600 shrink-0"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>

        </div>
    );
}
