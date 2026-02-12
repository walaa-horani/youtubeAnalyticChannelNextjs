"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Video,
    BarChart2,
    Settings,
    LogOut,
    Youtube,
    Menu
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";

const sidebarItems = [
    {
        title: "Overview",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Content",
        href: "/content",
        icon: Video,
    },
    {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart2,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

interface SidebarContentProps {
    className?: string;
    onLinkClick?: () => void;
}

function SidebarContent({ className, onLinkClick }: SidebarContentProps) {
    const pathname = usePathname();

    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="p-6 border-b flex items-center gap-2">
                <Youtube className="w-8 h-8 text-red-600" />
                <span className="font-bold text-xl tracking-tight">YT Manager</span>
            </div>

            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onLinkClick}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />
                            <span className="font-medium">{item.title}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t mt-auto">
                <SignOutButton>
                    <Button variant="outline" className="w-full justify-start gap-3">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </SignOutButton>
            </div>
        </div>
    );
}

export function Sidebar() {
    return (
        <div className="hidden md:flex h-screen w-64 bg-card border-r fixed left-0 top-0 z-50">
            <SidebarContent className="w-full" />
        </div>
    );
}

export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-6 h-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SidebarContent />
            </SheetContent>
        </Sheet>
    );
}
