"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function BackspacePreventer() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ব্রাউজারের হিস্ট্রি ধরে রাখার জন্য স্টেট পুশ করা
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      if (pathname !== "/") {
        router.push("/");
      } else {
        window.history.pushState(null, "", window.location.href);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Backspace" &&
        !(document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        router.push("/");
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname, router]);

  return null;
}