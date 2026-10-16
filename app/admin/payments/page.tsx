'use client';

export default function PaymentSettlementCenter() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment & Settlement Center (10.1 - 10.8)</h2>
          <p className="text-sm text-gray-500 mb-6">ক্যাশ অন ডেলিভারি, অনলাইন গেটওয়ে ট্রানজেকশন আইডি এবং কুরিয়ার COD সেটেলমেন্ট হিসাব।</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-xl bg-emerald-50 text-emerald-800 font-bold text-sm">
              Steadfast COD পাওনা: ৳১২,৪০০
            </div>
            <div className="p-4 border rounded-xl bg-blue-50 text-blue-800 font-bold text-sm">
              bKash / Nagad গেটওয়ে ব্যালেন্স: ৳৮,৫০০
            </div>
            <div className="p-4 border rounded-xl bg-amber-50 text-amber-800 font-bold text-sm">
              পেন্ডিং রিফান্ড: ৳১,২০০
            </div>
            <div className="p-4 border rounded-xl bg-rose-50 text-rose-800 font-bold text-sm">
              পেমেন্ট অমিল বা ডিসক্রিপেন্সি: ০ টি
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}