import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function copyCookies(source: NextResponse, target: NextResponse) {
    source.cookies.getAll().forEach((cookie) => {
        const { name, value, ...options } = cookie;
        target.cookies.set(name, value, options);
    });
    return target;
}

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                fetch: (url, options) => fetch(url, { ...options, cache: "no-store", next: { revalidate: 0 } })
            },
            cookieOptions: {
                name: "sb-web-auth-token",
            },
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    );
                },
            },
        }
    );

    // Routes that don't need auth checking
    const exactPublicRoutes = ["/", "/privacy-policy", "/refund-policy", "/terms-of-service"];

    // refreshing the auth token
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // 1. Protect Dashboard & Onboarding logic
    if (user) {
        const skipPaths = path.startsWith("/api") || path.startsWith("/_next") || path.includes(".");

        if (!skipPaths) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("onboarding_status, has_paid")
                .eq("id", user.id)
                .single();

            // Diagnostic Logging for Production Performance/Auth issues
            if (!profile && !path.startsWith("/_next")) {
                console.log(`[Middleware] No profile found for user ${user.id} at ${path}`);
            }

            const isCompleted = profile?.onboarding_status === "COMPLETED" || profile?.onboarding_status === "PLAN_GENERATED";

            // Check for active plan instead of stale has_paid
            const { data: purchases } = await supabase
                .from("user_plan_purchases")
                .select("id")
                .eq("user_id", user.id)
                .eq("status", "active")
                .limit(1);

            const hasPaid = Boolean(purchases && purchases.length > 0) || !!profile?.has_paid;

            if (path.startsWith("/onboarding")) {
                // ── User is on an onboarding page ──
                // If they've completed onboarding AND paid, redirect to dashboard
                // (prevents stale onboarding pages on refresh)
                if (isCompleted && hasPaid) {
                    return copyCookies(supabaseResponse, NextResponse.redirect(new URL("/dashboard", request.url)));
                }
                // If completed but NOT paid, allow '/onboarding/plan' but redirect
                // away from other onboarding pages
                if (isCompleted && !hasPaid && path !== "/onboarding/plan") {
                    return copyCookies(supabaseResponse, NextResponse.redirect(new URL(`/onboarding/plan?debug_reason=onboarding_redirect_no_paid&profileHasPaid=${profile?.has_paid}&purchases=${purchases?.length}`, request.url)));
                }
            } else if ((!path.startsWith("/profile") || path.startsWith("/profile/challenges")) && !path.startsWith("/learn") && !path.startsWith("/about") && !path.startsWith("/contact") && !path.startsWith("/privacy") && !path.startsWith("/terms") && !path.startsWith("/login") && !path.startsWith("/register") && !path.startsWith("/auth")) {
                // ── User is on a protected route (not onboarding, not profile) ──
                if (!profile || !isCompleted) {
                    // Not completed onboarding — force into onboarding flow
                    return copyCookies(supabaseResponse, NextResponse.redirect(new URL(`/onboarding?debug_reason=not_completed&paid=${hasPaid}`, request.url)));
                }
                // Onboarding is COMPLETED but hasn't paid — force to plan page (paywall)
                if (!hasPaid) {
                    return copyCookies(supabaseResponse, NextResponse.redirect(new URL(`/onboarding/plan?debug_reason=auth_no_paid&profileHasPaid=${profile?.has_paid}&purchases=${purchases?.length}`, request.url)));
                }
            }
        }
    }

    if ((path.startsWith("/dashboard") || path.startsWith("/onboarding")) && !user) {
        return copyCookies(supabaseResponse, NextResponse.redirect(new URL("/login", request.url)));
    }

    if (path === "/" && user) {
        // Redirection logic is handled above (if not completed -> onboarding, else -> dashboard)
        // If we reached here, it means user is logged in AND onboarding is COMPLETED (because of the check above)
        return copyCookies(supabaseResponse, NextResponse.redirect(new URL("/dashboard", request.url)));
    }

    return supabaseResponse;
}
