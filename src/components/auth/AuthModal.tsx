"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";
import { AuthCore } from "./AuthCore";

export function AuthModal({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-[calc(100%-2rem)] max-w-[850px] p-0 overflow-hidden gap-0 flex flex-col md:flex-row h-[600px] md:h-[500px] rounded-3xl">
                <DialogTitle className="sr-only">Login or Register</DialogTitle>
                <AuthCore isModal={true} onSuccess={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
