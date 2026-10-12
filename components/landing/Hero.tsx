"use client";

import Image from "next/image";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

const trustChips = [
  "🚚 COD Available",
  "🎁 Free Gift Box",
  "📍 Delivery All Over BD",
];

type HeroProps = {
  onHome: () => void;
};

export default function Hero({ onHome }: HeroProps) {
  // ইউজার লগ-ইন করা আছে কি না, তা চেক করার নতুন নিয়ম
  const { isSignedIn } = useUser();

  return (
    <header className="px-4 pt-5">
      
      {/* টপ বার: সার্চ বক্স এবং লগ-ইন বাটন */}
      <div className="mb-4 flex items-center justify-between gap-4">
        
        {/* সার্চ বার */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="প্রোডাক্ট খুঁজুন (যেমন: Couple Bracelet)..."
            className="w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
          <span className="absolute right-3 top-2.5 text-lg cursor-pointer">
            🔍
          </span>
        </div>

        {/* লগ-ইন বাটন */}
        <div className="flex-shrink-0">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-full bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-rose-600">
                লগ-ইন করুন
              </button>
            </SignInButton>
          )}
        </div>

      </div>

      {/* ব্যানার সেকশন */}
      <div
        onClick={onHome}
        className="group relative isolate min-h-[430px] cursor-pointer overflow-hidden rounded-[32px] border border-white/20 shadow-[0_25px_80px_-20px_rgba(244,63,94,0.35)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_100px_-20px_rgba(244,63,94,0.45)]"
      >
        {/* Background Image */}
        <Image
          src="/banner.jpeg"
          alt="Duo Corner couple collection banner"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/75" />

        {/* Soft Rose Glow */}
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-400/30 blur-3xl"
        />

        <div
          aria-hidden
          className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl"
        />

        {/* Content */}
        <div className="relative z-10 flex min-h-[430px] flex-col items-center justify-center px-5 py-12 text-center">
          {/* Store Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-lg backdrop-blur-xl md:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-300 shadow-[0_0_10px_rgba(253,164,175,0.9)]" />
            Official Store
          </div>

          {/* Trust Chips */}
          <div className="mt-7 flex max-w-xl flex-wrap justify-center gap-2">
            {trustChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[10px] font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/20 md:text-[11px]"
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Bottom Accent */}
          <div className="absolute bottom-5 left-1/2 h-px w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>
      </div>
    </header>
  );
}