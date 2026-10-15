'use client';

export default function Loader() {
  return (
    <div className="min-h-[85vh] w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      {/* ফিউচারিস্টিক রোমান্টিক কাপল ডান্স ও হার্ট অ্যানিমেশন */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-32 h-32 rounded-full border border-rose-500/30 animate-ping"></div>
        <div className="absolute w-24 h-24 rounded-full border border-pink-500/40 animate-pulse"></div>
        
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-orange-500 flex items-center justify-center shadow-2xl shadow-rose-600/50 transform hover:scale-110 transition duration-500 animate-bounce">
          <span className="text-4xl filter drop-shadow-lg">💃🕺</span>
        </div>

        <div className="absolute -top-4 -right-2 text-rose-400 text-2xl animate-pulse">
          💖
        </div>
        <div className="absolute -bottom-2 -left-4 text-pink-400 text-xl animate-bounce">
          ✨
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xs sm:text-sm font-black tracking-widest text-white uppercase bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 animate-pulse">
          DUO CORNER • ROMANTIC COLLECTION
        </h3>
        <p className="text-[11px] font-semibold text-slate-400 tracking-wider">
          ভালোবাসার উপহার ও কালেকশন লোড হচ্ছে... ✨
        </p>
      </div>
    </div>
  );
}