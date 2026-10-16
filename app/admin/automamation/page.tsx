'use client';

export default function AutomationCenter() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Business Automation & Rules Engine (11.1 - 11.7)</h2>
          <p className="text-sm text-gray-500">
            একটি ঘটনা (Event) ঘটলে পুরো সিস্টেমে কীভাবে স্বয়ংক্রিয়ভাবে স্টক, হিসাব এবং অর্ডার স্ট্যাটাস আপডেট হবে তার ইঞ্জিন।
          </p>

          <div className="border rounded-xl p-4 bg-amber-50 border-amber-200">
            <h4 className="font-bold text-amber-900 mb-1">⚠️ ১৭ নম্বর সেকশনের মূল ভিত্তি (Event-Driven Reconciliation):</h4>
            <ul className="text-xs text-amber-800 space-y-1 list-disc pl-4">
              <li>কুরিয়ার থেকে শুধু "Delivered" স্ট্যাটাস এলেই টাকা হাতে এসেছে ধরে নেওয়া যাবে না।</li>
              <li>"Return Initiated" হলেই পণ্য গুদামে ফিরে এসেছে ধরা যাবে না।</li>
              <li>প্রতিটি ধাপে বাস্তব ঘটনা যাচাই করে তবেই হিসাব সমন্বয় হবে।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}