'use client';
import { useState } from 'react';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';

type HeaderProps = {
  onHome: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCategorySelect?: (category: string) => void;
};

export default function Header({ onHome, searchQuery, setSearchQuery, onCategorySelect }: HeaderProps) {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (categoryName: string) => {
    onHome(); // প্রথমে হোমে নিয়ে আসবে যাতে ডিটেইলস পেজ থেকে ব্যাক হয়ে মূল গ্রিডে আসে
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
    setMobileMenuOpen(false);
    // প্রোডাক্ট সেকশনে স্মুথ স্ক্রোল করবে
    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#101010] border-b border-[#D4AF37]/20 shadow-xl font-sans">
      {/* টপ অ্যানাউন্সমেন্ট বার */}
      <div className="bg-gradient-to-r from-[#D4AF37] via-amber-500 to-[#D4AF37] text-black text-[10px] sm:text-[11px] font-bold py-1.5 px-2 text-center tracking-wide">
        🎁 একটি উপহারেই দুইটি মুখের হাসি  | 🚚 Fast Delivery Across Bangladesh
      </div>

      {/* মেইন নেভিগেশন বার */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* লোগো (হোম পেজে রিডাইরেক্ট করবে) */}
        <div 
          onClick={onHome} 
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black border border-[#D4AF37]/40 flex items-center justify-center overflow-hidden shadow-md group-hover:scale-105 transition">
            <img 
              src="/icon-192.png" 
              alt="Duo Corner Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <span className="text-sm sm:text-base font-black tracking-wider text-white block leading-none">DUO CORNER</span>
            <span className="text-[8px] sm:text-[9px] font-semibold text-[#D4AF37] tracking-widest uppercase">buy your happiness</span>
          </div>
        </div>

        {/* ক্যাটাগরি মেনু (ডেস্কটপ) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-300">
          <button onClick={onHome} className="hover:text-[#D4AF37] transition cursor-pointer">হোম</button>
          <button onClick={() => handleCategoryClick('Couple Gift')} className="hover:text-[#D4AF37] transition cursor-pointer">কাপল গিফট</button>
          <button onClick={() => handleCategoryClick('Necklace')} className="hover:text-[#D4AF37] transition cursor-pointer">নেকলেস ও ব্রেসলেট</button>
          <button onClick={() => handleCategoryClick('Gift Box')} className="hover:text-[#D4AF37] transition cursor-pointer">গিফট বক্স</button>
        </nav>

        {/* ডানপাশের ইউটিলিটি টুলস */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* রিয়েল-টাইম সার্চ উইজেট (মোবাইল ও ডেস্কটপ উভয় ডিভাইসে দৃশ্যমান) */}
          <div className="relative w-32 sm:w-44 lg:w-52">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              placeholder="সার্চ করুন..."
              className="w-full rounded-full bg-black/40 border border-[#D4AF37]/30 px-3.5 py-1.5 text-[11px] sm:text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition"
            />
            <button 
              type="button"
              onClick={() => {
                const section = document.getElementById('products-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              className="absolute right-3 top-1.5 sm:top-2 text-xs text-[#D4AF37] hover:scale-110 transition cursor-pointer"
              title="Search"
            >
              🔍
            </button>
          </div>

          {/* আমার অর্ডার */}
          <a
            href="/my-orders"
            className="flex items-center gap-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition shrink-0"
          >
            📦 <span className="hidden sm:inline">অর্ডার</span>
          </a>

          {/* ক্লাার্ক ইউজার অ্যাকাউন্ট */}
          <div className="flex items-center justify-center shrink-0">
            {isSignedIn ? (
              <UserButton appearance={{ elements: { avatarBox: "w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D4AF37]" } }} />
            ) : (
              <SignInButton mode="modal">
                <button className="bg-[#D4AF37] hover:bg-amber-600 text-black px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-black shadow-md transition cursor-pointer">
                  লগ-ইন
                </button>
              </SignInButton>
            )}
          </div>

          {/* মোবাইল মেনু টগল বাটন (হ্যামবার্গার আইকন) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#D4AF37] p-1 text-lg font-bold focus:outline-none cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

      </div>

      {/* মোবাইল ড্রপডাউন মেনু */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#141414] border-b border-[#D4AF37]/20 px-4 py-3 flex flex-col space-y-2.5 text-xs font-bold text-gray-200 shadow-2xl">
          <button onClick={onHome} className="text-left py-1.5 hover:text-[#D4AF37] transition border-b border-gray-800">হোম পেজ</button>
          <button onClick={() => handleCategoryClick('Couple Gift')} className="text-left py-1.5 hover:text-[#D4AF37] transition border-b border-gray-800">🎁 কাপল গিফট</button>
          <button onClick={() => handleCategoryClick('Necklace')} className="text-left py-1.5 hover:text-[#D4AF37] transition border-b border-gray-800">💎 নেকলেস ও ব্রেসলেট</button>
          <button onClick={() => handleCategoryClick('Gift Box')} className="text-left py-1.5 hover:text-[#D4AF37] transition">📦 গিফট বক্স</button>
        </div>
      )}
    </header>
  );
}