import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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