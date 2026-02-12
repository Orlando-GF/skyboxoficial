"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, LogOut, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Produtos", icon: Package },
    { href: "/admin/marketing", label: "Marketing", icon: LinkIcon },
    { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col h-screen fixed left-0 top-0">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-white font-display tracking-wider">
                        SKYBOX <span className="text-emerald-500 text-xs align-top">ADMIN</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 mb-1",
                                        isActive
                                            ? "bg-slate-800 text-white hover:bg-slate-800 hover:text-white"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-950/20">
                        <LogOut className="w-5 h-5" />
                        Sair
                    </Button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 flex justify-around p-2 backdrop-blur-lg bg-opacity-90">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="flex-1">
                            <div className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
                                isActive ? "text-primary" : "text-slate-500"
                            )}>
                                <item.icon className="w-6 h-6" />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
