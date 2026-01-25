"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Shield, LayoutDashboard, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/admins", label: "Superadmins", icon: Shield },
    { href: "/dashboard/roles", label: "Roles & Permissions", icon: Shield },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-gray-900 text-white">
            <div className="flex h-16 items-center justify-center border-b border-gray-800 px-6">
                <h1 className="text-xl font-bold">NEETStand Admin</h1>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
            <div className="border-t border-gray-800 p-4">
                <div className="text-xs text-gray-500">
                    Logged in as Admin
                </div>
            </div>
        </div>
    )
}
