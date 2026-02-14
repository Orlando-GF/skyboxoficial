import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-12 pb-24 md:pb-8 min-h-screen relative z-0">
                {/* Subtle Industrial Overlay - Fixed to viewport */}
                <div className="fixed inset-0 z-[-1] opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
