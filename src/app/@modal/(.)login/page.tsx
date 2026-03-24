"use client";

import { Modal } from "@/components/modal";
import { AuthCore } from "@/components/auth/AuthCore";
import { useSearchParams } from "next/navigation";

export default function LoginModal() {
    const searchParams = useSearchParams();
    const stepParam = searchParams.get("step");
    const emailParam = searchParams.get("email");

    return (
        <Modal>
            <AuthCore
                isModal={true}
                onSuccess={() => { window.location.href = "/onboarding"; }}
                initialStep={stepParam === "COLLECT_PHONE" ? "COLLECT_INFO" : undefined}
                prefilledEmail={emailParam || undefined}
            />
        </Modal>
    );
}
