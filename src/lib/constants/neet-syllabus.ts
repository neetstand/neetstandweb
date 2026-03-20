export const NEET_SYLLABUS = {
    Physics: [
        "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion",
        "Work, Energy and Power", "System of Particles and Rotational Motion", "Gravitation",
        "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter",
        "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves", "Electric Charges and Fields",
        "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism",
        "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves",
        "Ray Optics and Optical Instruments", "Wave Optics", "Dual Nature of Radiation and Matter",
        "Atoms", "Nuclei", "Semiconductor Electronics"
    ],
    Chemistry: [
        "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity",
        "Chemical Bonding and Molecular Structure", "Thermodynamics", "Equilibrium", "Redox Reactions",
        "The p-Block Elements", "Organic Chemistry: Principles", "Hydrocarbons", "Electrochemistry",
        "Chemical Kinetics", "Surface Chemistry", "The d- and f-Block Elements", "Coordination Compounds",
        "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids",
        "Amines", "Biomolecules"
    ],
    Biology: [
        "The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom",
        "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals",
        "Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division", "Photosynthesis in Higher Plants",
        "Respiration in Plants", "Plant Growth and Development", "Breathing and Exchange of Gases",
        "Body Fluids and Circulation", "Excretory Products and their Elimination", "Locomotion and Movement",
        "Neural Control and Coordination", "Chemical Coordination and Integration", "Sexual Reproduction in Flowering Plants",
        "Human Reproduction", "Reproductive Health", "Principles of Inheritance and Variation",
        "Molecular Basis of Inheritance", "Evolution", "Human Health and Disease", "Biotechnology: Principles and Processes",
        "Biotechnology and its Applications", "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation"
    ]
} as const;

export type Subject = keyof typeof NEET_SYLLABUS;
