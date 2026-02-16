import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { NotificationPreferencesCard } from "@/components/profile/NotificationPreferencesCard";
import { HaloBackground } from "@/components/HaloBackground";

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        // Handle case where profile doesn't exist (shouldn't happen with triggers, but good safety)
        return <div>Profile not found. Please contact support.</div>;
    }

    return (
        <main className="min-h-screen pt-[76px] pb-16 px-6 bg-sky-50 dark:bg-slate-900 text-sky-950 dark:text-slate-100 relative overflow-hidden">
            {/* Animated Halo Background */}
            <HaloBackground />

            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Left Column: Personal Info */}
                    <div className="md:col-span-1">
                        <ProfileInfoCard
                            user={{ email: user.email, phone: user.phone }}
                            profile={{
                                fullName: profile.full_name,
                                avatarUrl: profile.avatar_url,
                                role: profile.role,
                            }}
                        />
                    </div>

                    {/* Right Column: Preferences */}
                    <div className="md:col-span-2">
                        <NotificationPreferencesCard
                            preferences={{
                                newsletter: profile.newsletter,
                                courseLaunch: profile.course_launch,
                                cityEvents: profile.city_events,
                                email: profile.email,
                                sms: profile.sms,
                                phone: profile.phone,
                            }}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
