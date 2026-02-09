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
    Youtube
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

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

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="h-screen w-64 bg-card border-r flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b flex items-center gap-2">
                <Youtube className="w-8 h-8 text-red-600" />
                <span className="font-bold text-xl tracking-tight">YT Manager</span>
            </div>

            <div className="flex-1 py-6 px-4 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
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

            <div className="p-4 border-t">
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
