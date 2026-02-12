import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSettings } from "@/lib/getSettings";

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

  console.log(maintenance_mode, "maintenance_mode")

  const isMaintenance = maintenance_mode === "true";

  console.log(isMaintenance, "isMaintenance")

  if (isMaintenance) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Maintenance />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          {modal}
          <Toaster position="bottom-right" />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
