'use client';
import { useState } from 'react';

export default function CustomerManagement() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Customer & Fraud/Risk Management (8.1 - 8.5)</h2>
          <p className="text-sm text-gray-500 mb-6">গ্রাহকদের প্রোফাইল, অর্ডার হিস্ট্রি এবং ফেইক অর্ডার বা রিস্ক ইন্ডিকেটর চেক করুন।</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 border rounded-2xl bg-gray-50">
              <h3 className="font-bold text-gray-800 mb-2">8.1 Customer Segments</h3>
              <p className="text-xs text-gray-600">নতুন, নিয়মিত ও VIP গ্রাহকদের লিস্ট এবং তাদের মোট লাইফটাইম ভ্যালু (CLV) ক্যালকুলেশন।</p>
            </div>
            <div className="p-5 border rounded-2xl bg-gray-50">
              <h3 className="font-bold text-gray-800 mb-2">8.3 Order Risk Indicators</h3>
              <p className="text-xs text-gray-600">ডুপ্লিকেট অর্ডার বা পূর্ববর্তী ক্যানসেল/রিটার্ন প্যাটার্ন শনাক্তকরণ সিস্টেম।</p>
            </div>
            <div className="p-5 border rounded-2xl bg-gray-50">
              <h3 className="font-bold text-gray-800 mb-2">8.5 Automated Messaging</h3>
              <p className="text-xs text-gray-600">Order Confirmation ও Delivery Updates এসএমএস/নোটিফিকেশন পাঠানো।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}