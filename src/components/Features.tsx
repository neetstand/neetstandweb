import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Armchair, Stethoscope, Signpost } from "lucide-react";

export function Features() {
    const features = [
        {
            title: "Pause & Reflect",
            description: "Don't just rush. Stop, analyze your mistakes, and revise strategically.",
            icon: Armchair, // Representing the 'Bench'
        },
        {
            title: "Diagnostic-First",
            description: "Identify gaps with medical precision. Fix NCERT concepts that matter most.",
            icon: Stethoscope, // Representing the 'Medical Cross' / Accuracy
        },
        {
            title: "Clear Direction",
            description: "No more confusion. Get guided paths for your next steps in preparation.",
            icon: Signpost, // Representing the 'Direction Sign'
        },
    ];

    return (
        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Why <span className="text-primary">NeetStand</span>?
                </h2>
                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <CardDescription className="text-base">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
