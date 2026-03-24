"use client";

import { Modal } from "@/components/modal";
import { AuthCore } from "@/components/auth/AuthCore";

export default function LoginModal() {
    return (
        <Modal>
            <AuthCore
                isModal={true}
                onSuccess={() => { window.location.href = "/onboarding"; }}
                initialView="phone"
            />
        </Modal>
    );
}
