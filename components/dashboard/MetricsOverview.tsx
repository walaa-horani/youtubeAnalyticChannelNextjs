"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Play, Video } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ChannelStats, VideoStats } from "@/actions/youtube";

interface MetricsOverviewProps {
    channelInfo: {
        title: string;
        thumbnail: string;
        stats: ChannelStats;
    } | null;
    videoStats: VideoStats[];
}

export function MetricsOverview({ channelInfo, videoStats }: MetricsOverviewProps) {
    if (!channelInfo) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No channel data available. Did you sign in with Google?</p>
                </CardContent>
            </Card>
        );
    }

    // Transform video stats for the chart
    const chartData = videoStats.map((v) => ({
        name: v.title.substring(0, 15) + "...", // Truncate title
        views: parseInt(v.viewCount),
        likes: parseInt(v.likeCount),
    })).reverse(); // Show oldest to newest? No, newest is usually interesting. Let's keep reverse to show chronological left to right if API returns newest first.

    return (
        <div className="space-y-6">
            {/* Top Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{parseInt(channelInfo.stats.subscriberCount).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime subscribers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Play className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{parseInt(channelInfo.stats.viewCount).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime channel views</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{parseInt(channelInfo.stats.videoCount).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Videos uploaded</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Recent Video Performance</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ background: '#333', border: 'none', color: '#fff' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="views" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                                {/* <Bar dataKey="likes" fill="#2563eb" radius={[4, 4, 0, 0]} /> */}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
