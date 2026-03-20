"use client";

import SprintDashboard from "./SprintDashboard";

export default function BiologySprintDashboard({ plansData, ...props }: any) {
    return <SprintDashboard {...props} plansData={plansData} subjectFocus="biology" />;
}
