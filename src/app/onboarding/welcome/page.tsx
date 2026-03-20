import { StepLayout } from "@/components/onboarding/StepLayout";
import WelcomeContent from "./WelcomeContent";

export default function WelcomePage() {
    return (
        <StepLayout progress={10} showBack={false} className="-translate-y-10">
            <WelcomeContent />
        </StepLayout>
    );
}
