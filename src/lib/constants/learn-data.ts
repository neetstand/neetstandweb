// ─── Types ────────────────────────────────────────────────────────────────────
export interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    difficulty: "Easy" | "Moderate" | "Difficult";
    hints: string[];
}

export interface Video {
    id: string;
    title: string;
    language: "English" | "Hinglish";
    duration: string; // e.g. "12:34"
    thumbnailUrl?: string;
    url?: string;
    isKiller?: boolean;
}

export interface SubTopic {
    id: string;
    title: string;
    description: string;
    videos: Video[];
    questionCount: { easy: number; moderate: number; difficult: number };
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    icon: string; // lucide icon name
    subTopics: SubTopic[];
    totalQuestions: number;
    totalVideos: number;
    estimatedTime: string; // e.g. "2h 30m"
}

export interface SubjectData {
    id: string;
    title: string;
    color: string; // tailwind color key
    gradient: string; // tailwind gradient classes
    icon: string;
    topics: Topic[];
}

// ─── Helper: Generate mock questions ──────────────────────────────────────────
function generateQuestions(subTopicId: string, subTopicTitle: string): Question[] {
    const difficulties: Array<"Easy" | "Moderate" | "Difficult"> = [
        "Easy", "Easy", "Easy", "Easy", "Easy",
        "Moderate", "Moderate", "Moderate", "Moderate", "Moderate",
        "Difficult", "Difficult", "Difficult", "Difficult", "Difficult",
    ];
    return difficulties.map((d, i) => ({
        id: `${subTopicId}-q${i + 1}`,
        text: `${subTopicTitle} — Question ${i + 1} (${d})`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: (i * 7 + 3) % 4,   // deterministic, varied distribution
        difficulty: d,
        hints: [
            `Hint for Option A of question ${i + 1}.`,
            `Hint for Option B of question ${i + 1}.`,
            `Hint for Option C of question ${i + 1}.`,
            `Hint for Option D of question ${i + 1}.`
        ],
    }));
}

// ─── Helper: Generate videos per sub-topic ───────────────────────────────────
function generateVideos(subTopicId: string, subTopicTitle: string): Video[] {
    return [
        {
            id: `${subTopicId}-v1`,
            title: `${subTopicTitle} — Full Concept`,
            language: "English",
            duration: "18:42",
        },
        {
            id: `${subTopicId}-v2`,
            title: `${subTopicTitle} — Pura Concept Samjho`,
            language: "Hinglish",
            duration: "21:15",
        },
    ];
}

// ─── Helper: Build a sub-topic ────────────────────────────────────────────────
function buildSubTopic(topicId: string, index: number, title: string, description: string): SubTopic {
    const id = `${topicId}-st${index + 1}`;
    return {
        id,
        title,
        description,
        videos: generateVideos(id, title),
        questionCount: { easy: 5, moderate: 5, difficult: 5 },
    };
}

// ─── PHYSICS ──────────────────────────────────────────────────────────────────
const physicsTopics: Topic[] = [
    {
        id: "phy-mechanics",
        title: "Mechanics",
        description: "Laws of motion, work-energy, rotational motion & gravitation",
        icon: "Orbit",
        totalQuestions: 150,
        totalVideos: 10,
        estimatedTime: "6h 20m",
        subTopics: [
            buildSubTopic("phy-mechanics", 0, "Units & Measurements", "SI units, dimensional analysis, errors"),
            buildSubTopic("phy-mechanics", 1, "Kinematics", "Motion in 1D & 2D, projectile, circular"),
            buildSubTopic("phy-mechanics", 2, "Laws of Motion", "Newton's laws, friction, free‑body diagrams"),
            buildSubTopic("phy-mechanics", 3, "Work, Energy & Power", "Conservative forces, collisions, power"),
            buildSubTopic("phy-mechanics", 4, "Rotational Motion", "Moment of inertia, torque, angular momentum"),
        ],
    },
    {
        id: "phy-thermo",
        title: "Thermodynamics & Kinetic Theory",
        description: "Heat, thermal properties, gas laws and entropy",
        icon: "Flame",
        totalQuestions: 90,
        totalVideos: 6,
        estimatedTime: "3h 45m",
        subTopics: [
            buildSubTopic("phy-thermo", 0, "Thermal Properties of Matter", "Calorimetry, expansion, conduction"),
            buildSubTopic("phy-thermo", 1, "Thermodynamics", "Laws of thermodynamics, Carnot cycle"),
            buildSubTopic("phy-thermo", 2, "Kinetic Theory of Gases", "Ideal gas, degrees of freedom, RMS speed"),
        ],
    },
    {
        id: "phy-waves",
        title: "Waves & Oscillations",
        description: "SHM, sound waves, superposition and Doppler effect",
        icon: "AudioWaveform",
        totalQuestions: 60,
        totalVideos: 4,
        estimatedTime: "2h 30m",
        subTopics: [
            buildSubTopic("phy-waves", 0, "Oscillations (SHM)", "Simple & damped oscillations, resonance"),
            buildSubTopic("phy-waves", 1, "Waves", "Transverse, longitudinal, standing waves"),
        ],
    },
    {
        id: "phy-electro",
        title: "Electrostatics & Current Electricity",
        description: "Coulomb's law, capacitance, Ohm's law, circuits",
        icon: "Zap",
        totalQuestions: 120,
        totalVideos: 8,
        estimatedTime: "5h 10m",
        subTopics: [
            buildSubTopic("phy-electro", 0, "Electric Charges & Fields", "Coulomb's law, Gauss' theorem, field lines"),
            buildSubTopic("phy-electro", 1, "Electrostatic Potential & Capacitance", "Potential, dielectrics, capacitors"),
            buildSubTopic("phy-electro", 2, "Current Electricity", "Ohm's law, Kirchhoff's laws, Wheatstone bridge"),
            buildSubTopic("phy-electro", 3, "Moving Charges & Magnetism", "Biot-Savart, Ampere's law, galvanometer"),
        ],
    },
    {
        id: "phy-optics",
        title: "Optics & Modern Physics",
        description: "Ray & wave optics, photoelectric effect, atoms, nuclei",
        icon: "Eye",
        totalQuestions: 120,
        totalVideos: 8,
        estimatedTime: "5h",
        subTopics: [
            buildSubTopic("phy-optics", 0, "Ray Optics", "Reflection, refraction, lenses, prisms"),
            buildSubTopic("phy-optics", 1, "Wave Optics", "Interference, diffraction, polarization"),
            buildSubTopic("phy-optics", 2, "Dual Nature & Photoelectric Effect", "de Broglie, Einstein's equation"),
            buildSubTopic("phy-optics", 3, "Atoms & Nuclei", "Bohr model, radioactivity, binding energy"),
        ],
    },
];

// ─── CHEMISTRY ────────────────────────────────────────────────────────────────
const chemistryTopics: Topic[] = [
    {
        id: "chem-physical",
        title: "Physical Chemistry",
        description: "Stoichiometry, states of matter, thermodynamics, equilibrium",
        icon: "FlaskConical",
        totalQuestions: 150,
        totalVideos: 10,
        estimatedTime: "6h",
        subTopics: [
            buildSubTopic("chem-physical", 0, "Basic Concepts & Stoichiometry", "Mole concept, concentration terms"),
            buildSubTopic("chem-physical", 1, "Atomic Structure", "Bohr model, quantum numbers, orbitals"),
            buildSubTopic("chem-physical", 2, "Chemical Thermodynamics", "Enthalpy, Gibbs energy, Hess's law"),
            buildSubTopic("chem-physical", 3, "Equilibrium", "Le Chatelier's principle, pH, Ksp"),
            buildSubTopic("chem-physical", 4, "Electrochemistry", "Nernst equation, conductance, batteries"),
        ],
    },
    {
        id: "chem-inorganic",
        title: "Inorganic Chemistry",
        description: "Periodic table, bonding, coordination compounds, p/d/f-block",
        icon: "Atom",
        totalQuestions: 120,
        totalVideos: 8,
        estimatedTime: "5h",
        subTopics: [
            buildSubTopic("chem-inorganic", 0, "Periodic Table & Periodicity", "Trends, classification, electron config"),
            buildSubTopic("chem-inorganic", 1, "Chemical Bonding", "VSEPR, MOT, hybridisation"),
            buildSubTopic("chem-inorganic", 2, "p-Block Elements", "Group 13–18 chemistry, anomalous behaviour"),
            buildSubTopic("chem-inorganic", 3, "d- & f-Block Elements", "Transition metals, lanthanides, actinides"),
        ],
    },
    {
        id: "chem-organic",
        title: "Organic Chemistry",
        description: "GOC, hydrocarbons, functional group chemistry, biomolecules",
        icon: "Hexagon",
        totalQuestions: 150,
        totalVideos: 10,
        estimatedTime: "6h 30m",
        subTopics: [
            buildSubTopic("chem-organic", 0, "General Organic Chemistry", "IUPAC, isomerism, effects"),
            buildSubTopic("chem-organic", 1, "Hydrocarbons", "Alkanes, alkenes, alkynes, aromatic"),
            buildSubTopic("chem-organic", 2, "Haloalkanes & Haloarenes", "SN1/SN2, elimination, DDT"),
            buildSubTopic("chem-organic", 3, "Oxygen-containing Compounds", "Alcohols, phenols, ethers, carbonyl"),
            buildSubTopic("chem-organic", 4, "Nitrogen-containing & Biomolecules", "Amines, amino acids, DNA, polymers"),
        ],
    },
];

// ─── BIOLOGY ──────────────────────────────────────────────────────────────────
const biologyTopics: Topic[] = [
    {
        id: "bio-diversity",
        title: "Diversity in Living World",
        description: "Classification, plant & animal kingdoms",
        icon: "TreePine",
        totalQuestions: 90,
        totalVideos: 6,
        estimatedTime: "3h 30m",
        subTopics: [
            buildSubTopic("bio-diversity", 0, "The Living World", "Taxonomic categories, binomial nomenclature"),
            buildSubTopic("bio-diversity", 1, "Biological Classification", "Five kingdom classification"),
            buildSubTopic("bio-diversity", 2, "Plant Kingdom", "Algae to angiosperms, alternation of gen."),
        ],
    },
    {
        id: "bio-structural",
        title: "Structural Organisation",
        description: "Plant & animal morphology, anatomy of flowering plants",
        icon: "Flower2",
        totalQuestions: 90,
        totalVideos: 6,
        estimatedTime: "3h 45m",
        subTopics: [
            buildSubTopic("bio-structural", 0, "Morphology of Flowering Plants", "Root, stem, leaf, flower, fruit"),
            buildSubTopic("bio-structural", 1, "Anatomy of Flowering Plants", "Tissues, tissue systems, secondary growth"),
            buildSubTopic("bio-structural", 2, "Animal Organisation", "Organ & organ systems in animals"),
        ],
    },
    {
        id: "bio-cell",
        title: "Cell Biology & Biomolecules",
        description: "Cell structure, biomolecules, cell division",
        icon: "Circle",
        totalQuestions: 90,
        totalVideos: 6,
        estimatedTime: "4h",
        subTopics: [
            buildSubTopic("bio-cell", 0, "Cell: The Unit of Life", "Prokaryotic vs eukaryotic, organelles"),
            buildSubTopic("bio-cell", 1, "Biomolecules", "Carbohydrates, proteins, lipids, nucleic acids"),
            buildSubTopic("bio-cell", 2, "Cell Cycle & Cell Division", "Mitosis, meiosis, check-points"),
        ],
    },
    {
        id: "bio-physiology",
        title: "Human Physiology",
        description: "Digestion, respiration, circulation, excretion, movement, neural & hormonal control",
        icon: "HeartPulse",
        totalQuestions: 180,
        totalVideos: 12,
        estimatedTime: "7h 30m",
        subTopics: [
            buildSubTopic("bio-physiology", 0, "Breathing & Gas Exchange", "Mechanism, transport of O₂ & CO₂"),
            buildSubTopic("bio-physiology", 1, "Body Fluids & Circulation", "Blood, heart, ECG, double circulation"),
            buildSubTopic("bio-physiology", 2, "Excretory Products", "Nephron, urine formation, dialysis"),
            buildSubTopic("bio-physiology", 3, "Locomotion & Movement", "Muscles, skeleton, joints"),
            buildSubTopic("bio-physiology", 4, "Neural Control", "Neuron, CNS, reflex arc, sense organs"),
            buildSubTopic("bio-physiology", 5, "Chemical Coordination", "Endocrine glands, hormones, feedback"),
        ],
    },
    {
        id: "bio-genetics",
        title: "Genetics & Evolution",
        description: "Mendelian genetics, molecular biology, evolution",
        icon: "Dna",
        totalQuestions: 120,
        totalVideos: 8,
        estimatedTime: "5h",
        subTopics: [
            buildSubTopic("bio-genetics", 0, "Principles of Inheritance", "Mendel's laws, linkage, sex determination"),
            buildSubTopic("bio-genetics", 1, "Molecular Basis of Inheritance", "DNA replication, transcription, translation"),
            buildSubTopic("bio-genetics", 2, "Evolution", "Darwinism, Hardy-Weinberg, speciation"),
            buildSubTopic("bio-genetics", 3, "Human Health & Disease", "Immunity, AIDS, cancer, drugs"),
        ],
    },
    {
        id: "bio-ecology",
        title: "Ecology & Environment",
        description: "Organisms, populations, ecosystems, biodiversity",
        icon: "Globe",
        totalQuestions: 90,
        totalVideos: 6,
        estimatedTime: "3h",
        subTopics: [
            buildSubTopic("bio-ecology", 0, "Organisms & Populations", "Adaptations, population attributes"),
            buildSubTopic("bio-ecology", 1, "Ecosystem", "Energy flow, nutrient cycling, succession"),
            buildSubTopic("bio-ecology", 2, "Biodiversity & Conservation", "Hotspots, threats, strategies"),
        ],
    },
];

// ─── Exported Data ────────────────────────────────────────────────────────────
export const LEARN_SUBJECTS: SubjectData[] = [
    {
        id: "physics",
        title: "Physics",
        color: "sky",
        gradient: "from-sky-500 via-blue-500 to-indigo-600 dark:from-indigo-700 dark:via-blue-800 dark:to-indigo-900",
        icon: "Atom",
        topics: physicsTopics,
    },
    {
        id: "chemistry",
        title: "Chemistry",
        color: "sky",
        gradient: "from-sky-400 via-cyan-500 to-blue-600 dark:from-sky-700 dark:via-cyan-800 dark:to-sky-900",
        icon: "FlaskConical",
        topics: chemistryTopics,
    },
    {
        id: "biology",
        title: "Biology",
        color: "sky",
        gradient: "from-sky-500 via-teal-500 to-cyan-600 dark:from-teal-700 dark:via-emerald-800 dark:to-teal-900",
        icon: "Dna",
        topics: biologyTopics,
    },
];

export function getSubject(subjectId: string): SubjectData | undefined {
    return LEARN_SUBJECTS.find(s => s.id === subjectId);
}

export function getTopic(subjectId: string, topicId: string): Topic | undefined {
    return getSubject(subjectId)?.topics.find(t => t.id === topicId);
}

export function getQuestions(subTopicId: string, subTopicTitle: string): Question[] {
    return generateQuestions(subTopicId, subTopicTitle);
}
