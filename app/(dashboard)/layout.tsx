import { Sidebar as DashboardSidebar, MobileSidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen bg-muted/10">
            {/* Desktop Sidebar Navigation */}
            <DashboardSidebar />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 transition-all duration-300 ease-in-out">
                {/* Mobile Header / Trigger */}
                <div className="md:hidden p-4 border-b bg-background flex items-center gap-4 sticky top-0 z-40">
                    <MobileSidebar />
                    <span className="font-bold text-lg">YT Manager</span>
                </div>

                <div className="p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
