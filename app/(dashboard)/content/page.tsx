import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDetailedVideoStats } from "@/actions/youtube";
import { VideoTable } from "@/components/dashboard/VideoTable";

export const dynamic = 'force-dynamic';

export default async function ContentPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const videos = await getDetailedVideoStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Content</h1>
                <p className="text-muted-foreground mt-1">Manage and analyze your video content.</p>
            </div>

            <VideoTable videos={videos} />
        </div>
    );
}
