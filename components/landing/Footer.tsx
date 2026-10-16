'use client';
import { useState } from 'react';

type PolicyModalType = 'about' | 'privacy-policy' | 'terms' | 'howToOrder' | 'delivery' | 'return' | 'contact' | null;

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<PolicyModalType>(null);

  return (
    <>
      <footer className="bg-[#101010] text-white border-t border-[#D4AF37]/30 pt-16 pb-8 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
            
            {/* ব্র্যান্ড পরিচিতি ও মহৎ উদ্যোগ */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/40 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/icon-192.png" 
                    alt="Duo Corner Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-lg font-black tracking-wider text-white">DUO CORNER</span>
              </div>
              
              <p className="text-xs text-gray-300 leading-relaxed pr-4">
                DUO CORNER হলো ভালোবাসার সম্পর্কগুলোকে আরও গভীর ও স্মরণীয় করে তোলার একটি আধুনিক প্ল্যাটফর্ম। ইউনিক কাপল কালেকশন এবং প্রিমিয়াম গিফট দিয়ে প্রতিটি মুহূর্ত করুন স্মরণীয়।
              </p>

              <div className="bg-black/50 border border-[#D4AF37]/40 p-4 rounded-2xl space-y-1.5">
                <h5 className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <span>🥀</span> আমাদের মহৎ উদ্যোগ ও সামাজিক দায়বদ্ধতা
                </h5>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  আপনার প্রতিটি কেনাকাটার লভ্যাংশের একটি সুনির্দিষ্ট অংশ নিয়মিতভাবে অসহায় ও সুবিধাবঞ্চিত মানুষের অন্নসংস্থানের জন্য ব্যয় করা হয়। আপনিও এই মহৎ কাজের অংশীদার!
                </p>
              </div>
            </div>

            {/* Shop & Explore (সব পণ্য ও ক্যাটাগরি) */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-widest text-[#D4AF37] uppercase">Shop & Explore</h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li><a href="#products-section" className="hover:text-[#D4AF37] transition">সব পণ্য (All Products)</a></li>
                <li><a href="#products-section" className="hover:text-[#D4AF37] transition">কাপল গিফট (Couple Gifts)</a></li>
                <li><a href="#products-section" className="hover:text-[#D4AF37] transition">নেকলেস ও ব্রেসলেট</a></li>
                <li><button onClick={() => setActiveModal('about')} className="hover:text-[#D4AF37] transition text-left cursor-pointer">বিশেষ অফার (Offers)</button></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-widest text-[#D4AF37] uppercase">Customer Care</h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li><button onClick={() => setActiveModal('howToOrder')} className="hover:text-[#D4AF37] transition text-left cursor-pointer">অর্ডার করার নিয়ম</button></li>
                <li><button onClick={() => setActiveModal('delivery')} className="hover:text-[#D4AF37] transition text-left cursor-pointer">ডেলিভারি নীতি</button></li>
                <li><button onClick={() => setActiveModal('return')} className="hover:text-[#D4AF37] transition text-left cursor-pointer">রিটার্ন ও রিফান্ড পলিসি</button></li>
                <li><button onClick={() => setActiveModal('contact')} className="hover:text-[#D4AF37] transition text-left cursor-pointer">যোগাযোগ করুন (Contact)</button></li>
              </ul>
            </div>

            {/* About & Policies */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-widest text-[#D4AF37] uppercase">About & Policies</h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li><button onClick={() => setActiveModal('about')} className="hover:text-[#D4AF37] transition text-left cursor-pointer">আমাদের সম্পর্কে</button></li>
                <li><button onClick={() => setActiveModal('privacy-policy')} className="hover:text-[#D4AF37] transition text-left cursor-pointer">গোপনীয়তা নীতি (Privacy)</button></li>
                <li><button onClick={() => setActiveModal('terms')} className="hover:text-[#D4AF37] transition text-left cursor-pointer">শর্তাবলী (Terms & Conditions)</button></li>
              </ul>
            </div>

          </div>

          {/* সামাজিক মিডিয়া আইকনসমূহ (সঠিক অফিশিয়াল লিঙ্কসহ) */}
          <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-gray-800">
            <div>
              <h4 className="text-xs font-bold text-white mb-1">আমাদের সাথে যুক্ত থাকুন</h4>
              <p className="text-[11px] text-gray-400">সরাসরি অফিসিয়াল পেজ ও চ্যানেলে ভিজিট করুন</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a 
                href="https://web.facebook.com/profile.php?id=61580339883031" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook Page"
                className="w-10 h-10 rounded-xl bg-black border border-gray-800 hover:border-[#D4AF37] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md group"
              >
                <svg className="w-5 h-5 fill-current group-hover:text-[#D4AF37] transition" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/duocorner143?cplk=aXpzdm1jdGo1a2M3" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="w-10 h-10 rounded-xl bg-black border border-gray-800 hover:border-[#D4AF37] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md group"
              >
                <svg className="w-5 h-5 fill-current group-hover:text-[#D4AF37] transition" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a 
                href="https://www.tiktok.com/@duocorner143?_r=1&_t=ZS-9AarPyyCjqR" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="TikTok Profile"
                className="w-10 h-10 rounded-xl bg-black border border-gray-800 hover:border-[#D4AF37] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md group"
              >
                <svg className="w-5 h-5 fill-current group-hover:text-[#D4AF37] transition" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a 
                href="https://youtube.com/@duocorner143?si=9tguN6ou2I4MGpqH" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="YouTube Channel"
                className="w-10 h-10 rounded-xl bg-black border border-gray-800 hover:border-[#D4AF37] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md group"
              >
                <svg className="w-5 h-5 fill-current group-hover:text-[#D4AF37] transition" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ফুটার বটম বার */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-3">
            <p>© {currentYear} Duo Corner. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveModal('privacy-policy')} className="hover:text-[#D4AF37] transition cursor-pointer">Privacy Policy</button>
              <span>•</span>
              <button onClick={() => setActiveModal('terms')} className="hover:text-[#D4AF37] transition cursor-pointer">Terms & Conditions</button>
            </div>
          </div>

        </div>
      </footer>

      {/* কাস্টমার পলিসি ও ডিটেইলস পপআপ মডাল */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#141414] border border-[#D4AF37]/40 max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 rounded-3xl shadow-2xl text-white space-y-4 relative">
            
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-black text-sm sm:text-base text-[#D4AF37] uppercase tracking-wide">
                {activeModal === 'about' && 'আমাদের সম্পর্কে | DUO CORNER'}
                {activeModal === 'privacy-policy' && 'প্রাইভেসি পলিসি | DUO CORNER'}
                {activeModal === 'terms' && 'শর্তাবলী (Terms & Conditions)'}
                {activeModal === 'howToOrder' && 'যেভাবে অর্ডার করবেন'}
                {activeModal === 'delivery' && 'ডেলিভারি পলিসি ও চার্জ'}
                {activeModal === 'return' && 'রিটার্ন ও রিফান্ড পলিসি'}
                {activeModal === 'contact' && 'যোগাযোগ করুন | DUO CORNER'}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-white text-base font-bold w-8 h-8 flex items-center justify-center rounded-full bg-black/60 border border-gray-800 cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            <div className="text-xs sm:text-sm text-gray-300 leading-relaxed space-y-3">
              {activeModal === 'about' && (
                <>
                  <p className="font-bold text-white">About DUO CORNER</p>
                  <p>DUO CORNER হলো ভালোবাসার সম্পর্কগুলোকে আরও গভীর ও স্মরণীয় করে তোলার একটি আধুনিক প্ল্যাটফর্ম। আপনার প্রিয়জনের মুখের এক টুকরো হাসি ফুটাতে আমরা নিয়ে এসেছি ইউনিক কাপল কালেকশন, প্রিমিয়াম গিফট বক্স এবং এক্সক্লুসিভ রোমান্টিক এক্সেসরিজ। মানসম্মত পণ্য এবং বিশ্বস্ত সেবার মাধ্যমে কাস্টমারদের হৃদয়ে জায়গা করে নেওয়াই আমাদের মূল লক্ষ্য।</p>
                  <div className="bg-black/50 border border-[#D4AF37]/30 p-3.5 rounded-xl space-y-1">
                    <p className="font-bold text-[#D4AF37]">আমাদের সামাজিক দায়বদ্ধতা ও মহৎ উদ্যোগ:</p>
                    <p className="text-xs">ব্যবসা কেবল মুনাফা অর্জনের মাধ্যম নয়—এই দর্শনকে সামনে রেখে DUO CORNER তার প্রতিটি অর্ডারের লভ্যাংশের একটি সুনির্দিষ্ট অংশ নিয়মিতভাবে অসহায় ও সুবিধাবঞ্চিত মানুষের অন্নসংস্থানের জন্য ব্যয় করে থাকে।</p>
                  </div>
                </>
              )}

              {activeModal === 'privacy-policy' && (
                <>
                  <p className="font-bold text-white">Privacy & Data Security Policy</p>
                  <p>DUO CORNER আপনার ব্যক্তিগত গোপনীয়তা ও ডাটা সুরক্ষাকে সর্বোচ্চ অগ্রাধিকার দেয়। ওয়েবসাইট বা পেজে অর্ডার করার সময় আপনি যে নাম, ফোন নম্বর, ডেলিভারি ঠিকানা এবং ইমেল প্রদান করেন তা সম্পূর্ণ সুরক্ষিত থাকে।</p>
                  <p>আমরা আপনার কোনো ব্যক্তিগত তথ্য বা পরিচয় তৃতীয় কোনো বাণিজ্যিক পক্ষের কাছে বিক্রি বা শেয়ার করি না। শুধুমাত্র আপনার অর্ডার প্রসেসিং, কুরিয়ার বুকিং এবং ইনভয়েসিংয়ের কাজে এই তথ্যগুলো সংরক্ষিত রাখা হয়।</p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p className="font-bold text-white">Website Terms of Service</p>
                  <p>আমাদের ওয়েবসাইট ব্যবহারের ক্ষেত্রে নিচের শর্তাবলি প্রযোজ্য হবে:</p>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs">
                    <li>DUO CORNER কর্তৃপক্ষের পূর্ব ঘোষণা ছাড়াই ওয়েবসাইটের যেকোনো পণ্যের মূল্য, স্টক স্ট্যাটাস, ডিজাইন বা বিবরণ পরিবর্তন করার পূর্ণ অধিকার রয়েছে।</li>
                    <li>অনিবার্য কারণে কোনো পণ্যের স্টক ফুরিয়ে গেলে বা সাপ্লাই চেইনজনিত সমস্যায় অর্ডার বাতিল করার অধিকার কর্তৃপক্ষ রাখে; সেক্ষেত্রে ক্রেতার অগ্রিম পেমেন্ট সম্পূর্ণ ফেরত (Refund) দেওয়া হবে।</li>
                    <li>এই ওয়েবসাইটের লোগো, ব্র্যান্ড নেম, ব্যানার ডিজাইন বা যেকোনো কন্টেন্ট অনুমতি ছাড়া বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা বা কপি করা সম্পূর্ণ নিষিদ্ধ এবং আইনত দণ্ডনীয় অপরাধ।</li>
                  </ul>
                </>
              )}

              {activeModal === 'howToOrder' && (
                <>
                  <p className="font-bold text-white">Seamless Ordering Process</p>
                  <p>DUO CORNER থেকে আপনার পছন্দের প্রোডাক্ট অর্ডার করা অত্যন্ত সহজ ও নিরাপদ। নিচের ধাপগুলো অনুসরণ করুন:</p>
                  <div className="space-y-2 text-xs">
                    <p><strong>১. পণ্য নির্বাচন:</strong> আপনার পছন্দের গিফট আইটেমটি সিলেক্ট করে &quot;Add to Cart&quot; অথবা &quot;Order Now&quot; বাটনে ক্লিক করুন।</p>
                    <p><strong>২. শিপিং ইনফরমেশন:</strong> চেকআউট পেজে আপনার নাম, সচল মোবাইল নম্বর এবং সুনির্দিষ্ট ডেলিভারি ঠিকানা প্রদান করুন।</p>
                    <p><strong>৩. পেমেন্ট ও কনফার্মেশন:</strong> ক্যাশ অন ডেলিভারি (COD) অথবা মোবাইল ফাইন্যান্সিয়াল সার্ভিস সিলেক্ট করে অর্ডার প্লেস করুন।</p>
                  </div>
                </>
              )}

              {activeModal === 'delivery' && (
                <>
                  <p className="font-bold text-white">Fast & Reliable Nationwide Delivery</p>
                  <p>আমরা গ্রাহকদের দোরগোড়ায় দ্রুত ও নিরাপদে পণ্য পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ।</p>
                  <p><strong>ডেলিভারি সময়সীমা:</strong> ঢাকা মেট্রো ও বরিশাল সিটি কর্পোরেশন এলাকার মধ্যে সাধারণত ২ থেকে ৩ কার্যদিবস এবং ঢাকার বাইরে সারা বাংলাদেশে ৩ থেকে ৫ কার্যদিবসের মধ্যে পার্সেল ডেলিভারি করা হয়।</p>
                  <p><strong>কুরিয়ার পার্টনার:</strong> আমাদের নিরাপদ হোম ডেলিভারি নিশ্চিত করতে বিশ্বস্ত কুরিয়ার সার্ভিস যেমন Steadfast Courier এবং eCourier কাজ করছে।</p>
                </>
              )}

              {activeModal === 'return' && (
                <>
                  <p className="font-bold text-white">Customer Satisfaction & Return Guidelines</p>
                  <p>আমরা সর্বোচ্চ মানের পণ্য সরবরাহ নিশ্চিত করি। তবে বিশেষ পরিস্থিতিতে নিচের নিয়মগুলো প্রযোজ্য হবে:</p>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs">
                    <li>যদি আপনি কোনো ত্রুটিপূর্ণ, ক্ষতিগ্রস্থ বা ভুল পণ্য পেয়ে থাকেন, তবে পণ্য হাতে পাওয়ার ২৪ ঘণ্টার মধ্যে আমাদের জানাতে হবে।</li>
                    <li>রিটার্ন বা এক্সচেঞ্জের ক্ষেত্রে পার্সেল আনবক্সিংয়ের একটি পরিষ্কার ভিডিও প্রমাণ বাধ্যতামূলক।</li>
                    <li>কাস্টমার কর্তৃক ব্যবহৃত বা ক্ষতিগ্রস্থ পণ্যের সাধারণ রিটার্ন গ্রহণযোগ্য নয়। অভিযোগ সত্য প্রমাণিত হলে আমরা দ্রুত প্রোডাক্ট এক্সচেঞ্জ অথবা রিফান্ডের ব্যবস্থা করব।</li>
                  </ul>
                </>
              )}

              {activeModal === 'contact' && (
                <>
                  <p className="font-bold text-white">Get in Touch With Us</p>
                  <p>আপনার যেকোনো জিজ্ঞাসা, কাস্টম অর্ডার কিংবা অভিযোগের জন্য আমাদের সাথে যোগাযোগ করতে পারেন:</p>
                  <div className="space-y-1 text-xs">
                    <p>📍 <strong>লোকেশন:</strong> বরিশাল, বাংলাদেশ।</p>
                    <p>📞 <strong>হটলাইন / WhatsApp:</strong> 01777156691</p>
                    <p>✉️ <strong>অফিশিয়াল ইমেল:</strong> duocorner.official@gmail.com</p>
                    <p>💬 <strong>সোশ্যাল মিডিয়া:</strong> আমাদের অফিশিয়াল ফেসবুক পেজ ২৪/৭ খোলা থাকে। দ্রুত সহায়তার জন্য সরাসরি মেসেজ করুন।</p>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-gray-800 text-center">
              <button 
                onClick={() => setActiveModal(null)}
                className="bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black font-black px-6 py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}