'use client';

export default function LoadingModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 font-sans animate-fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-3xl p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)] border border-[#D4AF37]/40 max-w-sm w-full text-center relative overflow-hidden">
        
        {/* ব্যাকগ্রাউন্ড গ্লো */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* রোমান্টিক হার্ট ও স্পিন অ্যানিমেশন */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <span className="text-3xl animate-pulse">🥀</span>
        </div>

        <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-black bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
          DUO CORNER LOVE FLOW
        </span>

        <h3 className="text-xl font-black text-white mt-4 mb-2 tracking-wide">
          আপনার ভালোবাসার অর্ডারটি সাজানো হচ্ছে... ✨
        </h3>
        
        <p className="text-gray-300 text-xs leading-relaxed mb-4">
          আমাদের রোমান্টিক গিফট কালেকশন থেকে আপনার স্পেশাল মুহূর্তটিকে আরও সুন্দর করতে ডেটাগুলো সিস্টেমে সিকিউরড করা হচ্ছে। একটু অপেক্ষা করুন... ❤️
        </p>

        {/* ছোট লাভ বার */}
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-[#D4AF37] h-full w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}