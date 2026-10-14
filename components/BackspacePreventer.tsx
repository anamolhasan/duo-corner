'use client';
import { useEffect } from 'react';

export default function BackspacePreventer() {
  useEffect(() => {
    // ব্রাউজারের হিস্ট্রি স্ট্যাটাস পুশ করে রাখা যাতে ব্যাক বাটনে ক্লিক করলে সাইট থেকে বের না হয়ে যায়
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      alert('দুঃখিত! এই পেজ থেকে ব্যাকে যাওয়া যাবে না।');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}