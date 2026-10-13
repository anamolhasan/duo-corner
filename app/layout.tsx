import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
// Clerk-কে প্রজেক্টে নিয়ে আসলাম
import { ClerkProvider } from '@clerk/nextjs'; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Duo Corner | Exclusive Couple Gifts | Cash on Delivery",
  description:
    "Premium couple gift boxes, matching bracelets and exclusive couple collections.",
  manifest: "/manifest.json",
};

// কনসোলের ওয়ার্নিং ফিক্স করার জন্য themeColor কে এখানে viewport এ রাখা হয়েছে
export const viewport: Viewport = {
  themeColor: "#e11d48",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    // পুরো ওয়েবসাইটকে ClerkProvider দিয়ে মুড়িয়ে দিলাম
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}