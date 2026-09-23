import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";

import { PlayerProvider } from "@/components/music/PlayerProvider";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import { SiteContentProvider } from "@/components/site-content/SiteContentProvider";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import AuthSessionProvider from "@/components/auth/SessionProvider";
import { getSiteContent } from "@/lib/site-content";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Alien Chord",
  description: "Future electronic artist platform",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteContent = await getSiteContent();

  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${inter.variable}`}
      >
        <AuthSessionProvider>
          <LanguageProvider>
            <SiteContentProvider
              initialContent={siteContent}
            >
              <PlayerProvider>
                <AnalyticsTracker />
                {children}
              </PlayerProvider>
            </SiteContentProvider>
          </LanguageProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}