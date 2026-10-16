export default function TrustStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-[#101010] border border-[#D4AF37]/30 rounded-2xl py-4 px-6 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center">
          
          <div className="flex items-center justify-center gap-2.5 p-2 rounded-xl bg-black/40 border border-gray-800/80">
            <span className="text-lg">🚚</span>
            <div className="text-left">
              <h4 className="text-[11px] font-bold text-[#D4AF37] leading-tight">Cash on Delivery</h4>
              <p className="text-[9px] text-gray-400">হাতে পেয়ে মূল্য পরিশোধ</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-2 rounded-xl bg-black/40 border border-gray-800/80">
            <span className="text-lg">⚡</span>
            <div className="text-left">
              <h4 className="text-[11px] font-bold text-[#D4AF37] leading-tight">Delivery Info</h4>
              <p className="text-[9px] text-gray-400">সারাদেশে দ্রুত হোম ডেলিভারি</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-2 rounded-xl bg-black/40 border border-gray-800/80">
            <span className="text-lg">💬</span>
            <div className="text-left">
              <h4 className="text-[11px] font-bold text-[#D4AF37] leading-tight">Customer Support</h4>
              <p className="text-[9px] text-gray-400">আমাদের হোয়াটসঅ্যাপ এ যোগাযোগ করুন</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-2 rounded-xl bg-black/40 border border-gray-800/80">
            <span className="text-lg">🥀</span>
            <div className="text-left">
              <h4 className="text-[11px] font-bold text-[#D4AF37] leading-tight">Shop With Purpose</h4>
              <p className="text-[9px] text-gray-400">লভ্যাংশ দিয়ে খাবার সহায়তার মহৎ উদ্যোগ</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}