"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { updatePreferences } from "@/app/profile/actions";
import { Loader2, Bell, MessageSquare, Smartphone, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

interface NotificationPreferencesCardProps {
    preferences: {
        newsletter: boolean;
        courseLaunch: boolean;
        cityEvents: boolean;
        email: boolean;
        sms: boolean;
        phone: boolean;
    };
}

export function NotificationPreferencesCard({ preferences }: NotificationPreferencesCardProps) {
    const [loading, setLoading] = useState(false);
    const [localPreferences, setLocalPreferences] = useState(preferences);
    const router = useRouter();

    // Update local state when props change (e.g. after save and refresh)
    useEffect(() => {
        setLocalPreferences(preferences);
    }, [preferences]);

    // Check if there are any changes
    const hasChanges = Object.keys(preferences).some(
        (key) => preferences[key as keyof typeof preferences] !== localPreferences[key as keyof typeof localPreferences]
    );

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const res = await updatePreferences({}, formData);

        if (res.error) {
            toast.error(res.error);
        } else if (res.success) {
            toast.success(res.message);
            router.refresh();
        }

        setLoading(false);
    }

    const handleSwitchChange = (key: keyof typeof preferences) => (checked: boolean) => {
        setLocalPreferences((prev) => ({ ...prev, [key]: checked }));
    };

    return (
        <Card className="bg-white/50 dark:bg-slate-800/90 backdrop-blur-md border border-sky-100 dark:border-slate-700 shadow-xl dark:shadow-2xl h-fit">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    Notification Preferences
                </CardTitle>
                <CardDescription>Customize how and when you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-6">
                    {/* Delivery Channels Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-sky-900 dark:text-slate-200 flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            Delivery Channels
                        </h4>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="flex flex-col space-y-3 rounded-lg border border-sky-100 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <Mail className="h-5 w-5 text-sky-500" />
                                    <Switch
                                        name="email"
                                        checked={localPreferences.email}
                                        onCheckedChange={handleSwitchChange("email")}
                                        className="data-[state=checked]:bg-sky-500 dark:data-[state=checked]:bg-sky-400 dark:data-[state=unchecked]:bg-slate-700"
                                    />
                                </div>
                                <div>
                                    <Label className="text-base font-medium block mb-1">Email</Label>
                                    <CardDescription className="text-xs">Get updates via email.</CardDescription>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-3 rounded-lg border border-sky-100 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <MessageSquare className="h-5 w-5 text-green-500" />
                                    <Switch
                                        name="sms"
                                        checked={localPreferences.sms}
                                        onCheckedChange={handleSwitchChange("sms")}
                                        className="data-[state=checked]:bg-sky-500 dark:data-[state=checked]:bg-sky-400 dark:data-[state=unchecked]:bg-slate-700"
                                    />
                                </div>
                                <div>
                                    <Label className="text-base font-medium block mb-1">SMS</Label>
                                    <CardDescription className="text-xs">Get updates via SMS.</CardDescription>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-3 rounded-lg border border-sky-100 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <Phone className="h-5 w-5 text-purple-500" />
                                    <Switch
                                        name="phone"
                                        checked={localPreferences.phone}
                                        onCheckedChange={handleSwitchChange("phone")}
                                        className="data-[state=checked]:bg-sky-500 dark:data-[state=checked]:bg-sky-400 dark:data-[state=unchecked]:bg-slate-700"
                                    />
                                </div>
                                <div>
                                    <Label className="text-base font-medium block mb-1">Phone Call</Label>
                                    <CardDescription className="text-xs">Important calls only.</CardDescription>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-sky-100 dark:border-slate-800" />

                    {/* Content & Updates Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-sky-900 dark:text-slate-200 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Content & Updates
                        </h4>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex flex-row items-center justify-between rounded-lg border border-sky-100 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-medium">Newsletter</Label>
                                    <CardDescription className="text-xs">Weekly digest & tips.</CardDescription>
                                </div>
                                <Switch
                                    name="newsletter"
                                    checked={localPreferences.newsletter}
                                    onCheckedChange={handleSwitchChange("newsletter")}
                                    className="data-[state=checked]:bg-sky-500 dark:data-[state=checked]:bg-sky-400 dark:data-[state=unchecked]:bg-slate-700"
                                />
                            </div>
                            <div className="flex flex-row items-center justify-between rounded-lg border border-sky-100 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-medium">Course Launches</Label>
                                    <CardDescription className="text-xs">New study materials.</CardDescription>
                                </div>
                                <Switch
                                    name="courseLaunch"
                                    checked={localPreferences.courseLaunch}
                                    onCheckedChange={handleSwitchChange("courseLaunch")}
                                    className="data-[state=checked]:bg-sky-500 dark:data-[state=checked]:bg-sky-400 dark:data-[state=unchecked]:bg-slate-700"
                                />
                            </div>
                            <div className="flex flex-row items-center justify-between rounded-lg border border-sky-100 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-medium">City Events</Label>
                                    <CardDescription className="text-xs">Meetups near you.</CardDescription>
                                </div>
                                <Switch
                                    name="cityEvents"
                                    checked={localPreferences.cityEvents}
                                    onCheckedChange={handleSwitchChange("cityEvents")}
                                    className="data-[state=checked]:bg-sky-500 dark:data-[state=checked]:bg-sky-400 dark:data-[state=unchecked]:bg-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading || !hasChanges} className="bg-sky-600 hover:bg-sky-700 text-white min-w-[150px]">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Preferences
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
