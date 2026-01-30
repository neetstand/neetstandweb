import { AlertTriangle } from "lucide-react";

export function Maintenance() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-4 text-center">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/30">
                <AlertTriangle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
                Under Maintenance
            </h1>
            <p className="max-w-md text-muted-foreground">
                We are currently performing scheduled maintenance to improve our services.
                Please check back later.
            </p>
        </div>
    );
}
