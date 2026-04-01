// ─── 30-Day High-Yield PCB Sprint Data ───────────────────────────────────────
// Strategy: "Tactical Point Scoring" — prioritize high-yield/high-probability
// topics, slow-pace complex guaranteed-question areas, and consolidate every 5 days.

export type PriorityType =
    | "foundation"       // Direct marks, easy pickings
    | "visual-conceptual" // Needs diagrams, slow pace
    | "high-weightage"   // Guaranteed questions, go deep
    | "calculation"      // Formula-heavy, needs practice
    | "consolidation"    // Light load + power quiz
    | "high-yield"       // Most marks per hour spent
    | "application"      // Applying concepts to problems
    | "integration"      // Cross-topic connections
    | "revision"         // Rapid recall + error fixing
    | "mock-battle"      // Full-length timed test
    | "final-revision";  // Last push before exam

export interface DayTopic {
    /** Display label for the topic */
    label: string;
    /** Annotation — e.g. "(1 Q guaranteed)", "(Slow Pace)" */
    annotation?: string;
    /** Maps to learn-data subject ID */
    subjectId: string;
    /** Maps to learn-data topic ID */
    topicId: string;
    /** Maps to specific sub-topic ID within that topic */
    subTopicId?: string;
    /** Estimated study time in minutes */
    estimatedMinutes: number;
    /** NEET question probability: high | medium | low */
    probability: "high" | "medium" | "low";
    /** Complexity: 1-5 scale */
    complexity: number;
    /** The index of the last subtopic to show */
    endOrder?: number;
}

export interface DailyAssessment {
    type: "diagnostic" | "flash" | "power-quiz" | "memory-snap" | "mini-mock" | "full-mock" | "error-log";
    label: string;
    /** Duration in minutes */
    duration: number;
    /** Number of questions */
    questionCount: number;
    /** Covers material from which days */
    coversDays?: number[];
}

export interface SprintDay {
    day: number;
    priority: PriorityType;
    priorityLabel: string;
    /** Short motivational tag for the day */
    tagline: string;
    physics: DayTopic;
    chemistry: DayTopic;
    biology: DayTopic;
    assessment?: DailyAssessment;
    /** Is this a consolidation/rest day? */
    isConsolidation: boolean;
    /** Is this a milestone day? (Day 10, 15, 20, 25, 30) */
    isMilestone: boolean;
}

// ─── The 30 Days ──────────────────────────────────────────────────────────────
export const SPRINT_DAYS: SprintDay[] = [
    // ═══ WEEK 1: Foundation & High-Yield Start ═══
    {
        day: 1,
        priority: "foundation",
        priorityLabel: "Foundation / Direct Marks",
        tagline: "Grab the free marks first",
        physics: {
            label: "Units & Dimensions",
            annotation: "1 Q guaranteed",
            subjectId: "physics", topicId: "phy-mechanics", subTopicId: "phy-mechanics-st1",
            estimatedMinutes: 45, probability: "high", complexity: 1,
        },
        chemistry: {
            label: "Mole Concept (Basic)",
            subjectId: "chemistry", topicId: "chem-physical", subTopicId: "chem-physical-st1",
            estimatedMinutes: 50, probability: "high", complexity: 2,
        },
        biology: {
            label: "The Living World",
            annotation: "Sec 1-2",
            subjectId: "biology", topicId: "bio-diversity", subTopicId: "bio-diversity-st1",
            estimatedMinutes: 40, probability: "high", complexity: 1,
        },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 2,
        priority: "visual-conceptual",
        priorityLabel: "Visual / Conceptual (Slow Pace)",
        tagline: "See it to believe it",
        physics: {
            label: "Ray Optics — Lens & Mirror",
            annotation: "Slow pace",
            subjectId: "physics", topicId: "phy-optics", subTopicId: "phy-optics-st1",
            estimatedMinutes: 60, probability: "high", complexity: 3,
        },
        chemistry: {
            label: "GOC — Electronic Effects",
            subjectId: "chemistry", topicId: "chem-organic", subTopicId: "chem-organic-st1",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        biology: {
            label: "Cell: The Unit of Life",
            subjectId: "biology", topicId: "bio-cell", subTopicId: "bio-cell-st1",
            estimatedMinutes: 45, probability: "high", complexity: 2,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 1)", duration: 10, questionCount: 10, coversDays: [1] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 3,
        priority: "high-weightage",
        priorityLabel: "High-Weightage (Slow Pace)",
        tagline: "These questions will come, guaranteed",
        physics: {
            label: "Ray Optics — Instruments",
            annotation: "Slow pace",
            subjectId: "physics", topicId: "phy-optics", subTopicId: "phy-optics-st1",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        chemistry: {
            label: "GOC — Isomerism",
            subjectId: "chemistry", topicId: "chem-organic", subTopicId: "chem-organic-st1",
            estimatedMinutes: 55, probability: "high", complexity: 4,
        },
        biology: {
            label: "Cell Cycle & Division",
            subjectId: "biology", topicId: "bio-cell", subTopicId: "bio-cell-st3",
            estimatedMinutes: 50, probability: "high", complexity: 3,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 2)", duration: 10, questionCount: 10, coversDays: [2] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 4,
        priority: "calculation",
        priorityLabel: "Calculation Intensive",
        tagline: "Sharpen the numerical edge",
        physics: {
            label: "Kinematics — Graphs",
            subjectId: "physics", topicId: "phy-mechanics", subTopicId: "phy-mechanics-st2",
            estimatedMinutes: 50, probability: "high", complexity: 3,
        },
        chemistry: {
            label: "Chemical Bonding (VSEPR)",
            subjectId: "chemistry", topicId: "chem-inorganic", subTopicId: "chem-inorganic-st2",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        biology: {
            label: "Biological Classification",
            subjectId: "biology", topicId: "bio-diversity", subTopicId: "bio-diversity-st2",
            estimatedMinutes: 45, probability: "medium", complexity: 2,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 3) + Memory Snap", duration: 15, questionCount: 15, coversDays: [3, 1] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 5,
        priority: "consolidation",
        priorityLabel: "CONSOLIDATION DAY",
        tagline: "Cement what you've learned",
        physics: {
            label: "Error Review",
            annotation: "Light load",
            subjectId: "physics", topicId: "phy-mechanics",
            estimatedMinutes: 20, probability: "medium", complexity: 1,
        },
        chemistry: {
            label: "Error Review",
            annotation: "Light load",
            subjectId: "chemistry", topicId: "chem-physical",
            estimatedMinutes: 20, probability: "medium", complexity: 1,
        },
        biology: {
            label: "Error Review",
            annotation: "Light load",
            subjectId: "biology", topicId: "bio-diversity",
            estimatedMinutes: 20, probability: "medium", complexity: 1,
        },
        assessment: { type: "power-quiz", label: "30-Mark Power Quiz (Days 1-4)", duration: 30, questionCount: 30, coversDays: [1, 2, 3, 4] },
        isConsolidation: true, isMilestone: false,
    },

    // ═══ WEEK 2 BLOCK: HIGH-YIELD PUSH ═══
    {
        day: 6,
        priority: "high-yield",
        priorityLabel: "High-Yield (Max ROI)",
        tagline: "Maximum marks per minute",
        physics: {
            label: "Laws of Motion",
            annotation: "2-3 Qs expected",
            subjectId: "physics", topicId: "phy-mechanics", subTopicId: "phy-mechanics-st3",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        chemistry: {
            label: "Equilibrium",
            subjectId: "chemistry", topicId: "chem-physical", subTopicId: "chem-physical-st4",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        biology: {
            label: "Morphology of Flowering Plants",
            subjectId: "biology", topicId: "bio-structural", subTopicId: "bio-structural-st1",
            estimatedMinutes: 45, probability: "high", complexity: 2,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 5 Review)", duration: 10, questionCount: 10, coversDays: [5] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 7,
        priority: "high-yield",
        priorityLabel: "High-Yield (Max ROI)",
        tagline: "Keep the momentum",
        physics: {
            label: "Work, Energy & Power",
            annotation: "2 Qs expected",
            subjectId: "physics", topicId: "phy-mechanics", subTopicId: "phy-mechanics-st4",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        chemistry: {
            label: "Periodic Table & Periodicity",
            subjectId: "chemistry", topicId: "chem-inorganic", subTopicId: "chem-inorganic-st1",
            estimatedMinutes: 45, probability: "high", complexity: 2,
        },
        biology: {
            label: "Anatomy of Flowering Plants",
            subjectId: "biology", topicId: "bio-structural", subTopicId: "bio-structural-st2",
            estimatedMinutes: 50, probability: "high", complexity: 3,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 6)", duration: 10, questionCount: 10, coversDays: [6] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 8,
        priority: "application",
        priorityLabel: "Application Heavy",
        tagline: "Apply what you know",
        physics: {
            label: "Rotational Motion",
            annotation: "Slow pace needed",
            subjectId: "physics", topicId: "phy-mechanics", subTopicId: "phy-mechanics-st5",
            estimatedMinutes: 60, probability: "high", complexity: 4,
        },
        chemistry: {
            label: "Hydrocarbons",
            subjectId: "chemistry", topicId: "chem-organic", subTopicId: "chem-organic-st2",
            estimatedMinutes: 50, probability: "medium", complexity: 3,
        },
        biology: {
            label: "Biomolecules",
            subjectId: "biology", topicId: "bio-cell", subTopicId: "bio-cell-st2",
            estimatedMinutes: 45, probability: "high", complexity: 2,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 7)", duration: 10, questionCount: 10, coversDays: [7] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 9,
        priority: "high-weightage",
        priorityLabel: "High-Weightage",
        tagline: "Worth every second",
        physics: {
            label: "Electrostatic Potential & Capacitance",
            subjectId: "physics", topicId: "phy-electro", subTopicId: "phy-electro-st2",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        chemistry: {
            label: "Chemical Thermodynamics",
            subjectId: "chemistry", topicId: "chem-physical", subTopicId: "chem-physical-st3",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        biology: {
            label: "Plant Kingdom",
            subjectId: "biology", topicId: "bio-diversity", subTopicId: "bio-diversity-st3",
            estimatedMinutes: 45, probability: "medium", complexity: 2,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 8)", duration: 10, questionCount: 10, coversDays: [8] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 10,
        priority: "consolidation",
        priorityLabel: "CONSOLIDATION + MINI MOCK",
        tagline: "Week 2 checkpoint",
        physics: {
            label: "Error Review + Weak Areas",
            annotation: "Light load",
            subjectId: "physics", topicId: "phy-mechanics",
            estimatedMinutes: 25, probability: "medium", complexity: 1,
        },
        chemistry: {
            label: "Error Review + Weak Areas",
            annotation: "Light load",
            subjectId: "chemistry", topicId: "chem-organic",
            estimatedMinutes: 25, probability: "medium", complexity: 1,
        },
        biology: {
            label: "Error Review + Weak Areas",
            annotation: "Light load",
            subjectId: "biology", topicId: "bio-cell",
            estimatedMinutes: 25, probability: "medium", complexity: 1,
        },
        assessment: { type: "mini-mock", label: "50-Mark Mini Mock (Days 6-9)", duration: 45, questionCount: 50, coversDays: [6, 7, 8, 9] },
        isConsolidation: true, isMilestone: true,
    },

    // ═══ WEEK 3 BLOCK: DEEP DIVE ═══
    {
        day: 11,
        priority: "high-yield",
        priorityLabel: "High-Yield",
        tagline: "Physiology sprint begins",
        physics: {
            label: "Electric Charges & Fields",
            annotation: "Coulomb's law focus",
            subjectId: "physics", topicId: "phy-electro", subTopicId: "phy-electro-st1",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        chemistry: {
            label: "Atomic Structure",
            subjectId: "chemistry", topicId: "chem-physical", subTopicId: "chem-physical-st2",
            estimatedMinutes: 50, probability: "high", complexity: 2,
        },
        biology: {
            label: "Breathing & Gas Exchange",
            subjectId: "biology", topicId: "bio-physiology", subTopicId: "bio-physiology-st1",
            estimatedMinutes: 50, probability: "high", complexity: 2,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 10 Review)", duration: 10, questionCount: 10, coversDays: [10] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 12,
        priority: "high-weightage",
        priorityLabel: "High-Weightage (Guaranteed Qs)",
        tagline: "Every question counts",
        physics: {
            label: "Current Electricity",
            annotation: "2-3 Qs guaranteed",
            subjectId: "physics", topicId: "phy-electro", subTopicId: "phy-electro-st3",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        chemistry: {
            label: "Haloalkanes & Haloarenes",
            annotation: "SN1/SN2 focus",
            subjectId: "chemistry", topicId: "chem-organic", subTopicId: "chem-organic-st3",
            estimatedMinutes: 55, probability: "high", complexity: 4,
        },
        biology: {
            label: "Body Fluids & Circulation",
            annotation: "ECG, heart structure",
            subjectId: "biology", topicId: "bio-physiology", subTopicId: "bio-physiology-st2",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 11)", duration: 10, questionCount: 10, coversDays: [11] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 13,
        priority: "calculation",
        priorityLabel: "Calculation + Conceptual",
        tagline: "Numbers meet concepts",
        physics: {
            label: "Moving Charges & Magnetism",
            annotation: "Biot-Savart focus",
            subjectId: "physics", topicId: "phy-electro", subTopicId: "phy-electro-st4",
            estimatedMinutes: 55, probability: "high", complexity: 4,
        },
        chemistry: {
            label: "Electrochemistry",
            annotation: "Nernst equation",
            subjectId: "chemistry", topicId: "chem-physical", subTopicId: "chem-physical-st5",
            estimatedMinutes: 55, probability: "high", complexity: 4,
        },
        biology: {
            label: "Excretory Products",
            annotation: "Nephron diagram critical",
            subjectId: "biology", topicId: "bio-physiology", subTopicId: "bio-physiology-st3",
            estimatedMinutes: 45, probability: "high", complexity: 3,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 12)", duration: 10, questionCount: 10, coversDays: [12] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 14,
        priority: "visual-conceptual",
        priorityLabel: "Visual / Diagram Heavy",
        tagline: "Picture-perfect understanding",
        physics: {
            label: "Wave Optics",
            annotation: "Interference, diffraction",
            subjectId: "physics", topicId: "phy-optics", subTopicId: "phy-optics-st2",
            estimatedMinutes: 55, probability: "high", complexity: 4,
        },
        chemistry: {
            label: "p-Block Elements",
            annotation: "Group trends",
            subjectId: "chemistry", topicId: "chem-inorganic", subTopicId: "chem-inorganic-st3",
            estimatedMinutes: 50, probability: "high", complexity: 3,
        },
        biology: {
            label: "Locomotion & Movement",
            annotation: "Muscles, joints",
            subjectId: "biology", topicId: "bio-physiology", subTopicId: "bio-physiology-st4",
            estimatedMinutes: 45, probability: "medium", complexity: 2,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 13) + Memory Snap", duration: 15, questionCount: 15, coversDays: [13, 11] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 15,
        priority: "consolidation",
        priorityLabel: "MID-POINT REVIEW",
        tagline: "Halfway hero — you're doing great!",
        physics: {
            label: "Full Error Log Review",
            annotation: "All weak areas",
            subjectId: "physics", topicId: "phy-electro",
            estimatedMinutes: 30, probability: "medium", complexity: 1,
        },
        chemistry: {
            label: "Full Error Log Review",
            annotation: "All weak areas",
            subjectId: "chemistry", topicId: "chem-organic",
            estimatedMinutes: 30, probability: "medium", complexity: 1,
        },
        biology: {
            label: "Full Error Log Review",
            annotation: "All weak areas",
            subjectId: "biology", topicId: "bio-physiology",
            estimatedMinutes: 30, probability: "medium", complexity: 1,
        },
        assessment: { type: "mini-mock", label: "90-Mark Mini Mock (Full Syllabus)", duration: 60, questionCount: 90, coversDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
        isConsolidation: true, isMilestone: true,
    },

    // ═══ WEEK 4 BLOCK: ADVANCED + INTEGRATION ═══
    {
        day: 16,
        priority: "high-yield",
        priorityLabel: "High-Yield Sprint",
        tagline: "Second half begins strong",
        physics: {
            label: "Thermodynamics",
            annotation: "Carnot cycle",
            subjectId: "physics", topicId: "phy-thermo", subTopicId: "phy-thermo-st2",
            estimatedMinutes: 50, probability: "high", complexity: 3,
        },
        chemistry: {
            label: "Oxygen-containing Compounds",
            annotation: "Alcohols, carbonyls",
            subjectId: "chemistry", topicId: "chem-organic", subTopicId: "chem-organic-st4",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        biology: {
            label: "Neural Control",
            annotation: "Neuron structure critical",
            subjectId: "biology", topicId: "bio-physiology", subTopicId: "bio-physiology-st5",
            estimatedMinutes: 50, probability: "high", complexity: 3,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 15 Review)", duration: 10, questionCount: 10, coversDays: [15] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 17,
        priority: "high-weightage",
        priorityLabel: "High-Weightage",
        tagline: "Lock in the points",
        physics: {
            label: "Kinetic Theory of Gases",
            subjectId: "physics", topicId: "phy-thermo", subTopicId: "phy-thermo-st3",
            estimatedMinutes: 45, probability: "medium", complexity: 2,
        },
        chemistry: {
            label: "Nitrogen-containing & Biomolecules",
            annotation: "Amines, polymers",
            subjectId: "chemistry", topicId: "chem-organic", subTopicId: "chem-organic-st5",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        biology: {
            label: "Chemical Coordination",
            annotation: "Hormones table",
            subjectId: "biology", topicId: "bio-physiology", subTopicId: "bio-physiology-st6",
            estimatedMinutes: 50, probability: "high", complexity: 3,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 16)", duration: 10, questionCount: 10, coversDays: [16] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 18,
        priority: "high-yield",
        priorityLabel: "High-Yield",
        tagline: "Genetics is a goldmine",
        physics: {
            label: "Oscillations (SHM)",
            subjectId: "physics", topicId: "phy-waves", subTopicId: "phy-waves-st1",
            estimatedMinutes: 50, probability: "high", complexity: 3,
        },
        chemistry: {
            label: "d- & f-Block Elements",
            subjectId: "chemistry", topicId: "chem-inorganic", subTopicId: "chem-inorganic-st4",
            estimatedMinutes: 50, probability: "high", complexity: 3,
        },
        biology: {
            label: "Principles of Inheritance",
            annotation: "Mendel's laws — 3 Qs expected",
            subjectId: "biology", topicId: "bio-genetics", subTopicId: "bio-genetics-st1",
            estimatedMinutes: 55, probability: "high", complexity: 3,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 17)", duration: 10, questionCount: 10, coversDays: [17] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 19,
        priority: "integration",
        priorityLabel: "Integration & Cross-linking",
        tagline: "Connect the dots",
        physics: {
            label: "Waves",
            annotation: "Standing waves, Doppler",
            subjectId: "physics", topicId: "phy-waves", subTopicId: "phy-waves-st2",
            estimatedMinutes: 50, probability: "medium", complexity: 3,
        },
        chemistry: {
            label: "States of Matter",
            annotation: "Cross-link with thermo",
            subjectId: "chemistry", topicId: "chem-physical", subTopicId: "chem-physical-st1",
            estimatedMinutes: 45, probability: "medium", complexity: 2,
        },
        biology: {
            label: "Molecular Basis of Inheritance",
            annotation: "DNA replication — guaranteed Q",
            subjectId: "biology", topicId: "bio-genetics", subTopicId: "bio-genetics-st2",
            estimatedMinutes: 55, probability: "high", complexity: 4,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 18) + Memory Snap", duration: 15, questionCount: 15, coversDays: [18, 16] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 20,
        priority: "consolidation",
        priorityLabel: "CONSOLIDATION + POWER QUIZ",
        tagline: "3 weeks down — you're a warrior",
        physics: {
            label: "Error Review + Formulae Sheet",
            annotation: "Light load",
            subjectId: "physics", topicId: "phy-waves",
            estimatedMinutes: 25, probability: "medium", complexity: 1,
        },
        chemistry: {
            label: "Error Review + Reaction Sheet",
            annotation: "Light load",
            subjectId: "chemistry", topicId: "chem-organic",
            estimatedMinutes: 25, probability: "medium", complexity: 1,
        },
        biology: {
            label: "Error Review + Diagram Practice",
            annotation: "Light load",
            subjectId: "biology", topicId: "bio-genetics",
            estimatedMinutes: 25, probability: "medium", complexity: 1,
        },
        assessment: { type: "power-quiz", label: "60-Mark Power Quiz (Days 16-19)", duration: 45, questionCount: 60, coversDays: [16, 17, 18, 19] },
        isConsolidation: true, isMilestone: true,
    },

    // ═══ WEEK 5 BLOCK: FINISH + REVISE ═══
    {
        day: 21,
        priority: "high-yield",
        priorityLabel: "High-Yield Finish",
        tagline: "Cover all bases",
        physics: {
            label: "Dual Nature & Photoelectric Effect",
            annotation: "Einstein's equation",
            subjectId: "physics", topicId: "phy-optics", subTopicId: "phy-optics-st3",
            estimatedMinutes: 50, probability: "high", complexity: 3,
        },
        chemistry: {
            label: "Coordination Compounds",
            annotation: "Werner's theory, IUPAC",
            subjectId: "chemistry", topicId: "chem-inorganic", subTopicId: "chem-inorganic-st4",
            estimatedMinutes: 50, probability: "medium", complexity: 3,
        },
        biology: {
            label: "Evolution",
            annotation: "Hardy-Weinberg",
            subjectId: "biology", topicId: "bio-genetics", subTopicId: "bio-genetics-st3",
            estimatedMinutes: 45, probability: "medium", complexity: 2,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 20 Review)", duration: 10, questionCount: 10, coversDays: [20] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 22,
        priority: "high-yield",
        priorityLabel: "High-Yield",
        tagline: "Nuclear physics & ecology",
        physics: {
            label: "Atoms & Nuclei",
            annotation: "Bohr model, radioactivity",
            subjectId: "physics", topicId: "phy-optics", subTopicId: "phy-optics-st4",
            estimatedMinutes: 50, probability: "high", complexity: 3,
        },
        chemistry: {
            label: "Thermal Properties of Matter",
            subjectId: "chemistry", topicId: "chem-physical", subTopicId: "chem-physical-st3",
            estimatedMinutes: 45, probability: "medium", complexity: 2,
        },
        biology: {
            label: "Human Health & Disease",
            annotation: "Immunity critical",
            subjectId: "biology", topicId: "bio-genetics", subTopicId: "bio-genetics-st4",
            estimatedMinutes: 50, probability: "high", complexity: 2,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 21)", duration: 10, questionCount: 10, coversDays: [21] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 23,
        priority: "application",
        priorityLabel: "Ecology + Environment Sprint",
        tagline: "Free marks zone",
        physics: {
            label: "Thermal Properties of Matter",
            subjectId: "physics", topicId: "phy-thermo", subTopicId: "phy-thermo-st1",
            estimatedMinutes: 45, probability: "medium", complexity: 2,
        },
        chemistry: {
            label: "Surface Chemistry & Colloids",
            subjectId: "chemistry", topicId: "chem-physical", subTopicId: "chem-physical-st1",
            estimatedMinutes: 40, probability: "medium", complexity: 2,
        },
        biology: {
            label: "Organisms & Populations",
            annotation: "Direct scoring zone",
            subjectId: "biology", topicId: "bio-ecology", subTopicId: "bio-ecology-st1",
            estimatedMinutes: 45, probability: "high", complexity: 1,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 22)", duration: 10, questionCount: 10, coversDays: [22] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 24,
        priority: "high-yield",
        priorityLabel: "High-Yield Final Push",
        tagline: "Last new topics",
        physics: {
            label: "Semiconductor Basics",
            annotation: "1 Q guaranteed",
            subjectId: "physics", topicId: "phy-optics", subTopicId: "phy-optics-st4",
            estimatedMinutes: 45, probability: "high", complexity: 2,
        },
        chemistry: {
            label: "Environmental Chemistry",
            annotation: "Free marks",
            subjectId: "chemistry", topicId: "chem-physical", subTopicId: "chem-physical-st1",
            estimatedMinutes: 35, probability: "medium", complexity: 1,
        },
        biology: {
            label: "Ecosystem & Biodiversity",
            annotation: "Energy flow guaranteed Q",
            subjectId: "biology", topicId: "bio-ecology", subTopicId: "bio-ecology-st2",
            estimatedMinutes: 50, probability: "high", complexity: 2,
        },
        assessment: { type: "flash", label: "10-Min Flash (Day 23)", duration: 10, questionCount: 10, coversDays: [23] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 25,
        priority: "consolidation",
        priorityLabel: "CONSOLIDATION + MOCK BATTLE",
        tagline: "War room preparation",
        physics: {
            label: "Rapid Revision — All Formulae",
            annotation: "Speed review",
            subjectId: "physics", topicId: "phy-mechanics",
            estimatedMinutes: 30, probability: "high", complexity: 1,
        },
        chemistry: {
            label: "Rapid Revision — All Reactions",
            annotation: "Speed review",
            subjectId: "chemistry", topicId: "chem-organic",
            estimatedMinutes: 30, probability: "high", complexity: 1,
        },
        biology: {
            label: "Rapid Revision — All Diagrams",
            annotation: "Speed review",
            subjectId: "biology", topicId: "bio-physiology",
            estimatedMinutes: 30, probability: "high", complexity: 1,
        },
        assessment: { type: "mini-mock", label: "100-Mark Mini Mock (Full Syllabus)", duration: 75, questionCount: 100, coversDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
        isConsolidation: true, isMilestone: true,
    },

    // ═══ FINAL STRETCH: REVISION + MOCK ═══
    {
        day: 26,
        priority: "revision",
        priorityLabel: "Targeted Revision",
        tagline: "Fix what's broken",
        physics: {
            label: "Weak Area Deep Fix",
            annotation: "From mock analysis",
            subjectId: "physics", topicId: "phy-electro",
            estimatedMinutes: 45, probability: "high", complexity: 2,
        },
        chemistry: {
            label: "Weak Area Deep Fix",
            annotation: "From mock analysis",
            subjectId: "chemistry", topicId: "chem-organic",
            estimatedMinutes: 45, probability: "high", complexity: 2,
        },
        biology: {
            label: "Weak Area Deep Fix",
            annotation: "From mock analysis",
            subjectId: "biology", topicId: "bio-physiology",
            estimatedMinutes: 45, probability: "high", complexity: 2,
        },
        assessment: { type: "error-log", label: "Error Log Analysis", duration: 20, questionCount: 0, coversDays: [25] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 27,
        priority: "revision",
        priorityLabel: "Speed Revision",
        tagline: "Flash through everything",
        physics: {
            label: "5-Min per chapter rapid fire",
            annotation: "All chapters",
            subjectId: "physics", topicId: "phy-mechanics",
            estimatedMinutes: 40, probability: "high", complexity: 1,
        },
        chemistry: {
            label: "5-Min per chapter rapid fire",
            annotation: "All chapters",
            subjectId: "chemistry", topicId: "chem-physical",
            estimatedMinutes: 40, probability: "high", complexity: 1,
        },
        biology: {
            label: "5-Min per chapter rapid fire",
            annotation: "All chapters",
            subjectId: "biology", topicId: "bio-genetics",
            estimatedMinutes: 40, probability: "high", complexity: 1,
        },
        assessment: { type: "flash", label: "Rapid Fire Quiz", duration: 15, questionCount: 30, coversDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 28,
        priority: "mock-battle",
        priorityLabel: "FULL MOCK TEST #1",
        tagline: "Simulate the real exam",
        physics: {
            label: "Full Mock — Physics Section",
            annotation: "45 Qs, 180 marks",
            subjectId: "physics", topicId: "phy-mechanics",
            estimatedMinutes: 60, probability: "high", complexity: 5,
        },
        chemistry: {
            label: "Full Mock — Chemistry Section",
            annotation: "45 Qs, 180 marks",
            subjectId: "chemistry", topicId: "chem-physical",
            estimatedMinutes: 60, probability: "high", complexity: 5,
        },
        biology: {
            label: "Full Mock — Biology Section",
            annotation: "90 Qs, 360 marks",
            subjectId: "biology", topicId: "bio-physiology",
            estimatedMinutes: 60, probability: "high", complexity: 5,
        },
        assessment: { type: "full-mock", label: "Full NEET Mock (720 Marks)", duration: 200, questionCount: 180 },
        isConsolidation: false, isMilestone: true,
    },
    {
        day: 29,
        priority: "revision",
        priorityLabel: "Mock Analysis + Final Fix",
        tagline: "Learn from every mistake",
        physics: {
            label: "Mock Analysis — Fix Wrong Answers",
            annotation: "Critical review",
            subjectId: "physics", topicId: "phy-optics",
            estimatedMinutes: 45, probability: "high", complexity: 2,
        },
        chemistry: {
            label: "Mock Analysis — Fix Wrong Answers",
            annotation: "Critical review",
            subjectId: "chemistry", topicId: "chem-inorganic",
            estimatedMinutes: 45, probability: "high", complexity: 2,
        },
        biology: {
            label: "Mock Analysis — Fix Wrong Answers",
            annotation: "Critical review",
            subjectId: "biology", topicId: "bio-genetics",
            estimatedMinutes: 45, probability: "high", complexity: 2,
        },
        assessment: { type: "error-log", label: "Final Error Resolution", duration: 30, questionCount: 0, coversDays: [28] },
        isConsolidation: false, isMilestone: false,
    },
    {
        day: 30,
        priority: "final-revision",
        priorityLabel: "FINAL DAY — CONFIDENCE LOCK",
        tagline: "You're ready. Trust the process.",
        physics: {
            label: "High-Confidence Revision Only",
            annotation: "Strengths only",
            subjectId: "physics", topicId: "phy-mechanics",
            estimatedMinutes: 30, probability: "high", complexity: 1,
        },
        chemistry: {
            label: "High-Confidence Revision Only",
            annotation: "Strengths only",
            subjectId: "chemistry", topicId: "chem-physical",
            estimatedMinutes: 30, probability: "high", complexity: 1,
        },
        biology: {
            label: "High-Confidence Revision Only",
            annotation: "Strengths only",
            subjectId: "biology", topicId: "bio-physiology",
            estimatedMinutes: 30, probability: "high", complexity: 1,
        },
        assessment: { type: "full-mock", label: "Final Confidence Mock (360 Marks)", duration: 100, questionCount: 90, coversDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
        isConsolidation: false, isMilestone: true,
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getSprintDay(day: number): SprintDay | undefined {
    return SPRINT_DAYS.find(d => d.day === day);
}

export function getWeekDays(weekNumber: number): SprintDay[] {
    const start = (weekNumber - 1) * 5 + 1;
    const end = start + 4;
    return SPRINT_DAYS.filter(d => d.day >= start && d.day <= end);
}

export const PRIORITY_CONFIG: Record<PriorityType, { label: string; color: string; bgLight: string; bgDark: string; icon: string }> = {
    foundation: { label: "Foundation", color: "text-sky-600", bgLight: "bg-sky-50", bgDark: "dark:bg-sky-500/10", icon: "🧱" },
    "visual-conceptual": { label: "Visual/Conceptual", color: "text-cyan-600", bgLight: "bg-cyan-50", bgDark: "dark:bg-cyan-500/10", icon: "👁️" },
    "high-weightage": { label: "High-Weightage", color: "text-amber-600", bgLight: "bg-amber-50", bgDark: "dark:bg-amber-500/10", icon: "⚖️" },
    calculation: { label: "Calculation", color: "text-blue-600", bgLight: "bg-blue-50", bgDark: "dark:bg-blue-500/10", icon: "🔢" },
    consolidation: { label: "Consolidation", color: "text-emerald-600", bgLight: "bg-emerald-50", bgDark: "dark:bg-emerald-500/10", icon: "🔄" },
    "high-yield": { label: "High-Yield", color: "text-orange-600", bgLight: "bg-orange-50", bgDark: "dark:bg-orange-500/10", icon: "🎯" },
    application: { label: "Application", color: "text-violet-600", bgLight: "bg-violet-50", bgDark: "dark:bg-violet-500/10", icon: "⚙️" },
    integration: { label: "Integration", color: "text-teal-600", bgLight: "bg-teal-50", bgDark: "dark:bg-teal-500/10", icon: "🔗" },
    revision: { label: "Revision", color: "text-rose-600", bgLight: "bg-rose-50", bgDark: "dark:bg-rose-500/10", icon: "📝" },
    "mock-battle": { label: "Mock Battle", color: "text-red-600", bgLight: "bg-red-50", bgDark: "dark:bg-red-500/10", icon: "⚔️" },
    "final-revision": { label: "Final Revision", color: "text-yellow-600", bgLight: "bg-yellow-50", bgDark: "dark:bg-yellow-500/10", icon: "🏆" },
};
