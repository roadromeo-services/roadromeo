'use client';

import { useData } from '@/components/providers/DataProvider';

export default function AdminDashboard() {
    const { services, pricing, bikes } = useData();

    const stats = [
        { name: 'Active Services', value: services.length.toString(), color: 'text-blue-500' },
        { name: 'Pricing Packages', value: pricing.length.toString(), color: 'text-green-500' },
        { name: 'Bike Brands', value: bikes.length.toString(), color: 'text-purple-500' },
        { name: 'New Inquiries', value: '5', color: 'text-orange-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-black mb-2">Overview</h2>
                <p className="text-zinc-400">Manage your business data from one place.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                        <p className="text-sm text-zinc-500 font-medium mb-1">{stat.name}</p>
                        <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
                    <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-white">New Service Added: "Monsoon Special Checkup"</p>
                                    <p className="text-xs text-zinc-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 rounded-3xl bg-gradient-to-br from-red-600 to-black p-[1px]">
                    <div className="w-full h-full bg-zinc-950 rounded-3xl p-8">
                        <h3 className="text-xl font-bold mb-4 text-white">Quick Tips</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                            Making your data dynamic allows you to change prices and services instantly without redeploying your website.
                        </p>
                        <button className="px-6 py-2 rounded-xl bg-white text-black text-sm font-bold">
                            View Analytics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
