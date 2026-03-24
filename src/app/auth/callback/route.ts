import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/onboarding";

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data?.user) {
            const user = data.user;
            if (user) {
                // Check if user has a phone number (either in metadata or phone column)
                // We use metadata 'phone_number' for our safe updates, or 'phone' if system managed.
                const hasPhone = user.phone || user.user_metadata?.phone_number;

                if (!hasPhone) {
                    // Missing Phone -> Collect it
                    return NextResponse.redirect(`${origin}/login?step=COLLECT_PHONE&email=${encodeURIComponent(user.email || '')}`);
                }
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
