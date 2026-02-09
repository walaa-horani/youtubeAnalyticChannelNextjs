"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { VideoStats } from "@/actions/youtube";

interface VideoChartProps {
    videoStats: VideoStats[];
}

export function VideoChart({ videoStats }: VideoChartProps) {
    const chartData = videoStats.map((v) => ({
        name: v.title.substring(0, 15) + "...",
        views: parseInt(v.viewCount),
        likes: parseInt(v.likeCount),
    })).reverse();

    return (
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
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
