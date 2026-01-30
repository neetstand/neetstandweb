"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            router.back();
        }
    };

    return (
        <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
            <DialogOverlay className="bg-transparent" />
            <DialogContent className="w-[calc(100%-2rem)] max-w-[850px] p-0 overflow-hidden gap-0 flex flex-col md:flex-row h-[600px] md:h-[500px] rounded-3xl border-2 border-white bg-transparent shadow-none">
                <DialogTitle className="sr-only">Authentication</DialogTitle>
                {children}
            </DialogContent>
        </Dialog>
    );
}
