"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, LogOut, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Produtos", icon: Package },
    { href: "/admin/categories", label: "Categorias", icon: Package },
    { href: "/admin/marketing", label: "Marketing", icon: LinkIcon },
    { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-[#000000] border-r-2 border-white/5 hidden md:flex flex-col h-screen fixed left-0 top-0 z-40">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-white font-display tracking-wider uppercase">
                        SKYBOX <span className="text-primary text-[10px] align-top tracking-[0.3em] font-bold">ADMIN</span>
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
                                        "w-full justify-start gap-4 mb-2 rounded-none border-l-4 py-6 uppercase text-[10px] font-bold tracking-widest transition-all",
                                        isActive
                                            ? "bg-primary/5 border-primary text-primary hover:bg-primary/10 hover:text-primary"
                                            : "border-transparent text-slate-500 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/5 rounded-none uppercase text-[10px] font-bold tracking-widest transition-all">
                        <LogOut className="w-5 h-5" />
                        Sair do Sistema
                    </Button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#000000] border-t-2 border-primary/20 z-50 flex justify-around p-0">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="flex-1">
                            <div className={cn(
                                "flex flex-col items-center gap-1 p-3 transition-all",
                                isActive ? "text-primary bg-primary/5 border-t-2 border-primary" : "text-slate-600"
                            )}>
                                <item.icon className="w-6 h-6" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
