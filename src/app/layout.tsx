import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSettings } from "@/lib/getSettings";
import { GoogleTagManager } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neetstand",
  description: "NEET Exam Preparation Portal",
  icons: {
    icon: "/favicon.ico?v=2",
  },
};


import { Maintenance } from "@/components/Maintenance";

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const { maintenance_mode }: Record<string, string> = await getSettings()



  const isMaintenance = maintenance_mode === "true";



  if (isMaintenance) {
    return (
      <html lang="en" suppressHydrationWarning>
        <GoogleTagManager gtmId="GTM-5DL8T773" />
        <body className={inter.className}>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-5DL8T773"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          <Maintenance />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-5DL8T773" />
      <body className={inter.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5DL8T773"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            {children}
            {modal}
            <Toaster position="bottom-right" />
            <Footer />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
