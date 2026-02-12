import { refreshSettings } from "@/actions/refreshSettings";
import { allowedOrigins } from "@/lib/constants";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const authHeader = req.headers.get("authorization");
    const origin = req.headers.get("origin") || ""

    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!allowedOrigins.includes(origin)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    try {
        // Revalidate the cache tag 'settings'
        // Since getSettings uses "use cache" with cacheTag('settings'),
        // revalidating this tag will clear it.
        await refreshSettings();
        return NextResponse.json({ success: true, now: Date.now() });
    } catch (err) {
        console.error("Failed to refresh settings:", err);
        return NextResponse.json({ error: "Failed to refresh settings" }, { status: 500 });
    }
}
