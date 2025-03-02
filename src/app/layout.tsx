import { ClerkProvider } from "@clerk/nextjs";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Navbar } from "@/components/Navbar";
import QueryProvider from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shorten your long URL as eazy as Copy and Paste with COPAS",
  description:
    "URL Shortener service that easy to use, no need to signin, NO ADS and NO TRACKER built in",
  keywords: ["copas", "url", "shortening", "url shortener"],
  authors: { name: "Irvan Maulana Ahmad", url: "https://vanirvan.my.id/" },
  robots: { index: true, follow: true },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL!,
  },
  openGraph: {
    title: "Shorten your long URL as eazy as Copy and Paste with COPAS",
    description:
      "URL Shortener service that easy to use, no need to signin, NO ADS and NO TRACKER built in",
    url: process.env.NEXT_PUBLIC_APP_URL!,
  },
  twitter: {
    title: "Shorten your long URL as eazy as Copy and Paste with COPAS",
    description:
      "URL Shortener service that easy to use, no need to signin, NO ADS and NO TRACKER built in",
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryProvider>
              <Navbar />
              {children}
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
