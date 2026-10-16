'use client';

type ThankYouModalProps = {
  fullName: string;
  productName: string;
  total: number;
  onBack: () => void;
};

export default function ThankYouModal({
  fullName,
  productName,
  total,
  onBack
}: ThankYouModalProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in py-10 font-sans">
      <div className="bg-gradient-to-b from-slate-900 to-black rounded-3xl p-8 shadow-2xl border border-[#D4AF37]/40 max-w-md w-full text-center relative overflow-hidden">
        
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-[#D4AF37] text-black rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-[0_0_30px_rgba(212,175,55,0.5)] animate-bounce">
          ✓
        </div>

        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-black bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
          DUO CORNER EXCLUSIVE
        </span>

        <h2 className="text-2xl font-black text-white mt-4 mb-2 tracking-wide">
          অর্ডার সফলভাবে সম্পন্ন হয়েছে! 🥀
        </h2>
        
        <p className="text-gray-300 text-xs mb-6 leading-relaxed">
          প্রিয় <span className="text-[#D4AF37] font-bold">{fullName}</span>, আপনার অর্ডারটি সফলভাবে আমাদের সিস্টেমে রেকর্ড করা হয়েছে । খুব শীঘ্রই আমাদের প্রতিনিধি আপনার নাম্বারে কল করে কনফার্ম করবেন।
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left space-y-2 text-xs">
          <div className="flex justify-between text-gray-400">
            <span>প্রোডাক্ট:</span>
            <span className="text-white font-semibold truncate max-w-[180px]">{productName}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>মোট পরিমাণ:</span>
            <span className="text-[#D4AF37] font-black">৳{total} BDT</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>পেমেন্ট পদ্ধতি:</span>
            <span className="text-white font-semibold">Cash On Delivery</span>
          </div>
        </div>

        <button 
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            onBack();
          }}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-500 hover:to-[#D4AF37] text-black font-black py-3.5 px-6 rounded-xl shadow-lg transition-all cursor-pointer text-xs uppercase tracking-wider"
        >
          হোমপেজে ফিরে যান
        </button>
      </div>
    </div>
  );
}