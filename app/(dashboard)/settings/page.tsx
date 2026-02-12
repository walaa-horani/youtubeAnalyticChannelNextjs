// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
    // const { userId } = await auth();

    // if (!userId) {
    //     redirect("/sign-in");
    // }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
            </div>

            <div className="flex justify-center">
                {/* <UserProfile routing="hash" /> */}
                <p>Settings Profile (Clerk Disabled for Debug)</p>
            </div>
        </div>
    );
}
