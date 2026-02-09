import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDetailedVideoStats } from "@/actions/youtube";
import { VideoChart } from "@/components/dashboard/VideoChart";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const videos = await getDetailedVideoStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-1">Deep dive into your channel performance.</p>
            </div>

            <VideoChart videoStats={videos} />
        </div>
    );
}
