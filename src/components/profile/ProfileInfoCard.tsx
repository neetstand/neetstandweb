"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { updatePersonalInfo } from "@/app/profile/actions";
import { Loader2, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileInfoCardProps {
    user: {
        email?: string;
        phone?: string;
    };
    profile: {
        fullName: string | null;
        avatarUrl: string | null;
        role: string;
    };
}

export function ProfileInfoCard({ user, profile }: ProfileInfoCardProps) {
    const [loading, setLoading] = useState(false);
    const [displayName, setDisplayName] = useState(profile.fullName || "");
    const router = useRouter();

    // Update local state when props change (e.g. after save and refresh)
    useEffect(() => {
        setDisplayName(profile.fullName || "");
    }, [profile.fullName]);

    // Determine if the button should be disabled
    const hasChanges = displayName !== (profile.fullName || "");
    const isValid = displayName.trim().length >= 3;
    const isSaveDisabled = loading || !hasChanges || !isValid;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const res = await updatePersonalInfo({}, formData);

        if (res.error) {
            toast.error(res.error);
        } else if (res.success) {
            toast.success(res.message);
            router.refresh();
        }

        setLoading(false);
    }

    return (
        <Card className="bg-white/50 dark:bg-slate-800/90 backdrop-blur-md border border-sky-100 dark:border-slate-700 shadow-xl dark:shadow-2xl h-fit">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24 ring-4 ring-sky-100 dark:ring-slate-800 shadow-lg">
                        <AvatarImage src={profile.avatarUrl || ""} alt={profile.fullName || "User"} />
                        <AvatarFallback className="text-2xl bg-sky-200 dark:bg-slate-700 text-sky-800 dark:text-slate-200">
                            {(profile.fullName || user.email || "?").charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle>{profile.fullName || "Your Profile"}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Display Name</Label>
                        <div className="flex gap-2">
                            <Input
                                id="fullName"
                                name="fullName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your Name"
                                className="bg-white/50 dark:bg-slate-950/50 border-sky-200 dark:border-slate-700 focus-visible:ring-sky-400"
                            />
                            <Button type="submit" size="sm" disabled={isSaveDisabled} className="bg-sky-600 hover:bg-sky-700 text-white shrink-0">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                            </Button>
                        </div>
                        {!isValid && displayName.length > 0 && (
                            <p className="text-xs text-red-500">Name must be at least 3 characters.</p>
                        )}
                    </div>
                </form>

                <div className="space-y-2">
                    <Label htmlFor="roleDisplay">Role</Label>
                    <div className="px-3 py-2 rounded-md bg-sky-100/50 dark:bg-slate-800/50 text-sm font-medium text-sky-800 dark:text-sky-300 capitalize border border-sky-200 dark:border-slate-700">
                        {profile.role}
                    </div>
                </div>

                {/* Read-only Contact info */}
                <div className="pt-4 border-t border-sky-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Linked Accounts</p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-sky-900 dark:text-slate-300">
                                <Mail className="h-4 w-4 text-sky-500" />
                                Email
                            </span>
                            <span className="text-muted-foreground truncate max-w-[120px]" title={user.email}>{user.email}</span>
                        </div>
                        {user.phone && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-sky-900 dark:text-slate-300">
                                    <Phone className="h-4 w-4 text-green-500" />
                                    Phone
                                </span>
                                <span className="text-muted-foreground">{user.phone}</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
