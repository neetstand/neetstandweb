export const allowedOrigins = [
    "http://localhost:3000",
    "https://admin.neetstand.com",
    "http://admin.neetstand.com",
    "http://localhost:4000"
];

export const AppConfig = {
    appName: "Neetstand",
    appVersion: "1.0.0",
    appDescription: "NEET Exam Preparation Portal",
    appLogo: "/favicon.ico",
    appFavicon: "/favicon.ico",
    appIcon: "/favicon.ico",
    appLogoAlt: "Neetstand Logo",
    appUrl: "https://neetstand.com",
    appUrlDev: "http://localhost:3000",
    marketingEmail: "neetstand@neetstand.com",
    supportEmail: "support@neetstand.com",
    companyName: "Dhanvid Edutech",
    companyAddress: " B9 Shubh Aangan, Raipura Road, Kota , Rajasthan, 324006."
} as const;

export type AppConfigType = typeof AppConfig;