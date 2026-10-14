"use client";

import { useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

const trustChips = [
  "🚚 COD Available",
  "🎁 Free Gift Box",
  "📍 Delivery All Over BD",
];

type HeroProps = {
  onHome: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function Hero({ onHome, searchQuery, setSearchQuery }: HeroProps) {
  const { isSignedIn } = useUser();

  const [reviews, setReviews] = useState([
    { name: 'তানভীর আহমেদ', rating: 5, comment: 'পণ্যটি হাতে পেয়েছি, ছবির মতোই সুন্দর! কাপল গিফট হিসেবে একদম পারফেক্ট।', date: '১২ অক্টোবর, ২০২৬' },
    { name: 'সাদিয়া ইসলাম', rating: 5, comment: 'কোয়ালিটি অনেক ভালো লেগেছে। ডেলিভারিও খুব দ্রুত পেয়েছি ধন্যবাদ Duo Corner!', date: '১০ অক্টোবর, ২০২৬' },
    { name: 'রাহুল খান', rating: 4, comment: 'সবকিছু ঠিকঠাক ছিল, প্যাকেজিংটা আরেকটু ভালো হতে পারত।', date: '০৮ অক্টোবর, ২০২৬' }
  ]);

  const [showAllModal, setShowAllModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newComment) return;

    const newRev = {
      name: newName,
      rating: newRating,
      comment: newComment,
      date: 'আজ'
    };

    setReviews([newRev, ...reviews]);
    setNewName('');
    setNewComment('');
    setNewRating(5);
    setShowReviewModal(false);
    alert('আপনার মূল্যবান রিভিউ ও রেটিংটি সফলভাবে জমা হয়েছে!');
  };

  const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const avgRating = (totalRating / reviews.length).toFixed(1);

  return (
    <header className="px-4 pt-5">
      
      {/* টপ বার: সার্চ বক্স, আমার অর্ডার বাটন এবং লগ-ইন বাটন */}
      <div className="mb-4 flex items-center justify-between gap-4">
        
        {/* সার্চ বার (রিয়েল-টাইম ডাইনামিক ফিল্টার যুক্ত) */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="প্রোডাক্ট খুঁজুন (যেমন: Couple Necklace)..."
            className="w-full rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition-all focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 placeholder:text-gray-400"
          />
          <span className="absolute right-3.5 top-3 text-sm text-gray-400 pointer-events-none">
            🔍
          </span>
        </div>

        {/* ডানপাশের বাটনসমূহ */}
        <div className="flex items-center gap-2 flex-shrink-0">
          
          <a
            href="/my-orders"
            className="flex items-center gap-1 rounded-full bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 shadow-xs transition-all hover:bg-rose-100"
          >
            📦 আমার অর্ডার
          </a>

          <div className="flex items-center justify-center">
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 rounded-full border border-rose-200"
                  }
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button className="rounded-full bg-rose-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-rose-600">
                  লগ-ইন করুন
                </button>
              </SignInButton>
            )}
          </div>

        </div>

      </div>

      {/* ব্যানার সেকশন */}
      <div
        onClick={onHome}
        className="group relative isolate h-[400px] w-full cursor-pointer overflow-hidden rounded-[32px] border border-white/25 shadow-[0_25px_80px_-20px_rgba(244,63,94,0.35)] transition-all duration-500 hover:-translate-y-1"
      >
        <img 
          src="/banner.jpg" 
          alt="Duo Corner couple collection banner" 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />

        <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8 text-center">
          
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-lg backdrop-blur-xl md:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-300 shadow-[0_0_10px_rgba(253,164,175,0.9)]" />
              Duo Corner Official Store
            </div>
          </div>

          <div></div>

          <div className="grid grid-cols-3 gap-2 w-full max-w-lg mx-auto items-center">
            <div className="text-left">
              <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg backdrop-blur-md">
                {trustChips[0]}
              </span>
            </div>
            <div className="text-center">
              <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg backdrop-blur-md">
                {trustChips[1]}
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg backdrop-blur-md">
                {trustChips[2]}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 🌟 কাস্টমার রেটিং ও রিভিউ ডিসপ্লে সেকশন */}
      <div className="mt-4 bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b pb-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <span>⭐</span> কাস্টমার রেটিং ও রিভিউ
            </h3>
            <p className="text-[11px] text-gray-500">আমাদের সন্তুষ্ট গ্রাহকদের প্রকৃত অভিজ্ঞতা</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-base font-black text-gray-900">{avgRating}</span>
              <span className="text-amber-500 text-xs ml-1">★★★★★</span>
              <p className="text-[10px] text-gray-400">মোট {reviews.length}টি রেটিং</p>
            </div>

            <button 
              onClick={() => setShowReviewModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              + রিভিউ দিন
            </button>

            {reviews.length > 1 && (
              <button 
                onClick={() => setShowAllModal(true)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-rose-100 cursor-pointer"
              >
                সব রেটিং দেখুন ({reviews.length}) →
              </button>
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="bg-gradient-to-r from-rose-50/40 to-pink-50/20 border border-rose-100/80 p-3.5 rounded-2xl relative">
            <div className="absolute top-2.5 right-2.5 bg-rose-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm">
              শীর্ষ রিভিউ
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-xs text-gray-800">{reviews[0].name}</span>
              <span className="text-amber-500 text-xs">{"★".repeat(reviews[0].rating)}</span>
              <span className="text-gray-400 text-[10px] ml-auto">{reviews[0].date}</span>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed">{reviews[0].comment}</p>
          </div>
        )}

      </div>

      {/* রিভিউ দেওয়ার পপআপ ফর্ম */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800 text-sm">আপনার রিভিউ ও রেটিং দিন</h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">স্টার রেটিং (১ থেকে ৫)</label>
                <select 
                  value={newRating} 
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value={5}>★★★★★ (৫ স্টার)</option>
                  <option value={4}>★★★★☆ (৪ স্টার)</option>
                  <option value={3}>★★★☆☆ (৩ স্টার)</option>
                  <option value={2}>★★☆☆☆ (২ স্টার)</option>
                  <option value={1}>★☆☆☆☆ (১ স্টার)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">আপনার নাম</label>
                <input 
                  type="text" 
                  placeholder="আপনার নাম লিখুন..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">আপনার মতামত</label>
                <textarea 
                  placeholder="পণ্য বা সার্ভিস সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                রিভিউ সাবমিট করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* সব রিভিউ দেখার পপআপ মডাল */}
      {showAllModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full max-h-[80vh] overflow-y-auto p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800 text-sm">সকল কাস্টমার রেটিং ({reviews.length})</h3>
              <button 
                onClick={() => setShowAllModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {reviews.map((rev, index) => (
                <div key={index} className="border-b border-gray-100 pb-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-800">{rev.name}</span>
                    <span className="text-amber-500 text-xs">{"★".repeat(rev.rating)}</span>
                  </div>
                  <p className="text-gray-600 text-xs">{rev.comment}</p>
                  <p className="text-[10px] text-gray-400">{rev.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </header>
  );
}