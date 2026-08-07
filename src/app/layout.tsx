import type { Metadata } from "next";
import { Syne } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";


const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "Alien Chord",
  description: "Future electronic artist platform",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body
  className={`
    ${syne.variable}
    ${inter.variable}
    font-[var(--font-inter)]
  `}
>
        {children}
      </body>
    </html>
  );
}
