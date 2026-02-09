"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VideoStats } from "@/actions/youtube";
import { Eye, ThumbsUp, MessageCircle, Calendar } from "lucide-react";

interface VideoTableProps {
    videos: VideoStats[];
}

export function VideoTable({ videos }: VideoTableProps) {
    return (
        <Card className="shadow-sm border-muted/40">
            <CardHeader>
                <CardTitle>Recent Content Performance</CardTitle>
                <CardDescription>Detailed metrics for your last 50 videos</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[400px]">Video</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">Likes</TableHead>
                            <TableHead className="text-right">Comments</TableHead>
                            <TableHead className="text-right">Engagement</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.map((video) => {
                            const views = parseInt(video.viewCount) || 0;
                            const likes = parseInt(video.likeCount) || 0;
                            const comments = parseInt(video.commentCount) || 0;
                            const engagementRate = views > 0 ? ((likes + comments) / views * 100).toFixed(2) : "0";

                            return (
                                <TableRow key={video.id} className="group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-14 rounded-md overflow-hidden relative shadow-sm border">
                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="flex-1 max-w-[280px]">
                                                <p className="font-medium truncate" title={video.title}>{video.title}</p>
                                                <span className="text-xs text-muted-foreground">{video.id}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(video.publishedAt).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        <div className="flex items-center justify-end gap-1">
                                            <Eye className="w-3 h-3 text-muted-foreground" />
                                            {parseInt(video.viewCount).toLocaleString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <ThumbsUp className="w-3 h-3 text-green-500" />
                                            {parseInt(video.likeCount).toLocaleString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <MessageCircle className="w-3 h-3 text-blue-500" />
                                            {parseInt(video.commentCount).toLocaleString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={Number(engagementRate) > 5 ? "default" : "secondary"}>
                                            {engagementRate}%
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
