export const CHALLENGE_ISSUE_TYPES = [
    "Typo or Grammar Error",
    "Incorrect Answer Key",
    "Image is Missing or Blur",
    "Question is Incomplete",
    "Out of Syllabus",
    "Topic Mismatch",
    "Other Issue"
] as const;

export type ChallengeIssueType = typeof CHALLENGE_ISSUE_TYPES[number];
