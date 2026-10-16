'use client';
export default function ReportsPage() {
  return (
    <div className="p-6 bg-slate-950 text-white min-h-screen font-sans">
      <h1 className="text-xl font-black mb-6">📊 Professional Reports & BI Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h3 className="font-bold text-sm">Realized Profit & Loss</h3>
          <p className="text-xs text-slate-400 mt-2">বাস্তবসম্মত লাভ ও মার্জিন রিপোর্ট দেখুন।</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h3 className="font-bold text-sm">Courier Success & Return Rate</h3>
          <p className="text-xs text-slate-400 mt-2">কুরিয়ার পারফরম্যান্স অ্যানালিসিস।</p>
        </div>
      </div>
    </div>
  );
}