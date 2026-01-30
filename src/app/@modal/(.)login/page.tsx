"use client";

import { Modal } from "@/components/modal";
import { AuthCore } from "@/components/auth/AuthCore";
import { useRouter } from "next/navigation";

export default function LoginModal() {
    const router = useRouter();

    return (
        <Modal>
            <AuthCore
                isModal={true}
                onSuccess={() => router.back()}
                initialView="phone"
            />
        </Modal>
    );
}
