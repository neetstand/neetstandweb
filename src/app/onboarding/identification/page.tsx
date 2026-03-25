import { Suspense } from "react";
import { IdentificationForm } from "./IdentificationForm";

export default function IdentificationPage() {
    return (
        <Suspense fallback={<div className="h-[80vh] flex items-center justify-center">Loading...</div>}>
            <IdentificationForm />
        </Suspense>
    );
}
