import { updateSettingsCache } from "@/lib/getSettings";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Revalidate the cache tag 'settings'
        // Since getSettings uses "use cache" with cacheTag('settings'),
        // revalidating this tag will clear it.
        await updateSettingsCache();

        return NextResponse.json({ success: true, now: Date.now() });
    } catch (err) {
        console.error("Failed to refresh settings:", err);
        return NextResponse.json({ error: "Failed to refresh settings" }, { status: 500 });
    }
}
