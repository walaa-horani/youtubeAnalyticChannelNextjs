import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getChannelStats, getDetailedVideoStats } from "@/actions/youtube";
import { StatCards } from "@/components/dashboard/StatCards";
import { VideoChart } from "@/components/dashboard/VideoChart";
import { AgentChat } from "@/components/dashboard/AgentChat";

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Fetch data in parallel
    const [channelData, videos] = await Promise.all([
        getChannelStats(),
        getDetailedVideoStats()
    ]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                    <p className="text-muted-foreground mt-1">Welcome back! Here is what is happening with your channel.</p>
                </div>
                {channelData && (
                    <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 p-2 pr-4 rounded-full shadow-sm border">
                        <img src={channelData.thumbnail} className="w-8 h-8 rounded-full" />
                        <span className="font-semibold text-sm">{channelData.title}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Metrics & Content */}
                <div className="lg:col-span-2 space-y-8">
                    <StatCards stats={channelData?.stats} />
                    <VideoChart videoStats={videos} />
                </div>

                {/* Right Column: AI Agent */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <AgentChat />
                    </div>
                </div>
            </div>
        </div>
    );
}
