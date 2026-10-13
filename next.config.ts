import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Turbopack কনফিগ এরর দূর করার জন্য এটি যোগ করতে হবে
  turbopack: {}, 
};

export default withPWA(nextConfig);