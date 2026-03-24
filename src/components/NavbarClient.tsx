"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, User as UserIcon, LogOut, Settings, Flag } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";


export function NavbarClient({ initialUser }: { initialUser: SupabaseUser | null }) {
    const { setTheme, theme } = useTheme();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [user, setUser] = useState<SupabaseUser | null>(initialUser);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    // Check if we are on an auth page
    const isAuthPage = pathname === "/login" || pathname === "/register";

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (_event === 'SIGNED_OUT') {
                router.refresh(); // Refresh to update server components if any
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase, router]);


    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY;

                // Show navbar if scrolling up or at the very top
                // Hide if scrolling down and past 100px
                if (currentScrollY === 0) {
                    setIsVisible(true);
                } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    setIsVisible(false);
                } else if (currentScrollY < lastScrollY) {
                    setIsVisible(true);
                }

                setLastScrollY(currentScrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/"); // Redirect to home after sign out
    };

    // Extract first name or email
    const displayName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || "User";
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;


    return (
        <nav className={cn(
            "border-b bg-sky-300 dark:bg-background sticky top-0 z-50 transition-transform duration-300",
            isVisible ? "translate-y-0" : "-translate-y-full"
        )}>
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                    <div className="relative h-14 w-auto">
                        <Image
                            src="/neetstand-light.png"
                            alt="NeetStand Logo"
                            width={210}
                            height={56}
                            style={{ width: 'auto', height: '56px' }}
                            className="object-contain block dark:hidden"
                            priority
                        />
                        <Image
                            src="/neetstand-dark.png"
                            alt="NeetStand Logo"
                            width={210}
                            height={56}
                            style={{ width: 'auto', height: '56px' }}
                            className="object-contain hidden dark:block"
                            priority
                        />
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {user ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium hidden sm:inline-block">
                                Hi, {displayName}
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={avatarUrl} alt={displayName} />
                                            <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || displayName}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer" asChild>
                                        <Link href="/profile" className="flex items-center w-full">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" asChild>
                                        <Link href="/profile/challenges" className="flex items-center w-full text-amber-600 focus:text-amber-700 font-medium">
                                            <Flag className="mr-2 h-4 w-4" />
                                            <span>Challenges</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleSignOut}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            {!isAuthPage && (
                                <Button asChild className="cursor-pointer rounded-xl bg-white text-blue-600 hover:bg-blue-50 dark:bg-white dark:text-blue-900 dark:hover:bg-blue-50 shadow-sm hover:shadow-md border border-blue-100 dark:border-transparent transition-all duration-300 hover:-translate-y-0.5 px-6">
                                    <Link href="/login" scroll={false}>
                                        Login
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
