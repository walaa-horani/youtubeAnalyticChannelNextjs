"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export interface ChannelStats {
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
}

export interface VideoStats {
    id: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
    viewCount: string;
    likeCount: string;
    commentCount: string;
}

// ... (interfaces remain same)

async function getGoogleToken() {
    const { userId } = await auth();
    if (!userId) {
        return null;
    }

    try {
        const client = await clerkClient();
        const response = await client.users.getUserOauthAccessToken(userId, "oauth_google");

        if (response.data.length > 0) {
            const token = response.data[0].token;
            console.log("Debug Token (from clerkClient):", token ? `${token.substring(0, 10)}...` : "null");
            return token;
        }
        console.log("Debug: No Google OAuth token found in clerkClient response.");
        return null;
    } catch (e) {
        console.error("Error getting Google Token:", e);
        return null;
    }
}

export async function getChannelStats() {
    const token = await getGoogleToken();
    if (!token) return null;

    try {
        const response = await fetch(
            "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("YouTube API Channels Error:", response.status, errorText);
            return null;
        }

        const data = await response.json();
        console.log("YouTube API Channels Data:", JSON.stringify(data, null, 2));

        if (!data.items || data.items.length === 0) {
            console.warn("YouTube API: No channel found for this user.");
            return null;
        }

        const channel = data.items[0];
        return {
            title: channel.snippet.title,
            thumbnail: channel.snippet.thumbnails.default.url,
            stats: channel.statistics as ChannelStats,
        };
    } catch (error) {
        console.error("Error fetching channel stats:", error);
        return null;
    }
}

export async function getDetailedVideoStats() {
    const token = await getGoogleToken();
    if (!token) return [];

    try {
        // 1. Get recent uploads
        const searchResponse = await fetch(
            "https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&type=video&maxResults=50&order=date",
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (!searchResponse.ok) return [];
        const searchData = await searchResponse.json();

        if (!searchData.items || searchData.items.length === 0) return [];

        const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",");

        // 2. Get stats for these videos
        const statsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (!statsResponse.ok) return [];
        const statsData = await statsResponse.json();

        // 3. Merge data
        const videos = statsData.items.map((item: any) => {
            return {
                id: item.id,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high.url,
                publishedAt: item.snippet.publishedAt,
                viewCount: item.statistics?.viewCount || "0",
                likeCount: item.statistics?.likeCount || "0",
                commentCount: item.statistics?.commentCount || "0",
            };
        });

        return videos as VideoStats[];

    } catch (error) {
        console.error("Error fetching video stats:", error);
        return [];
    }
}
