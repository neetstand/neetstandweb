"use client";

import SprintDashboard from "./SprintDashboard";

export default function PhysicsSprintDashboard({ plansData, ...props }: any) {
    return <SprintDashboard {...props} plansData={plansData} subjectFocus="physics" />;
}
