"use client";

import SprintDashboard from "./SprintDashboard";

export default function ChemistrySprintDashboard({ plansData, ...props }: any) {
    return <SprintDashboard {...props} plansData={plansData} subjectFocus="chemistry" />;
}
