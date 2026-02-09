"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Play, Video } from "lucide-react";
import { ChannelStats } from "@/actions/youtube";

interface StatCardsProps {
    stats: ChannelStats | undefined; // ChannelStats might be nested or direct? In existing code it's nested in channelInfo.stats
}

export function StatCards({ stats }: StatCardsProps) {
    if (!stats) return null;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{parseInt(stats.subscriberCount).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Lifetime subscribers</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{parseInt(stats.viewCount).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Lifetime channel views</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                    <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{parseInt(stats.videoCount).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Videos uploaded</p>
                </CardContent>
            </Card>
        </div>
    );
}
