"use client";

import { Modal } from "@/components/modal";
import { AuthCore } from "@/components/auth/AuthCore";
import { useSearchParams } from "next/navigation";

export default function RegisterModal() {
    const searchParams = useSearchParams();
    const emailParam = searchParams.get("email");

    return (
        <Modal>
            <AuthCore
                isModal={true}
                onSuccess={() => { window.location.href = "/onboarding"; }}
                initialView="register"
                prefilledEmail={emailParam || undefined}
            />
        </Modal>
    );
}
