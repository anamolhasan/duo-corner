'use client';
import { useState, useEffect } from 'react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    // গুগল শিট বা ডাটাবেজ থেকে কাস্টমার ফেচ করার লজিক
  }, []);

  return (
    <div className="p-6 bg-slate-950 text-white min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-black">👥 Customer Control Center & Risk Management</h1>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <p className="text-xs text-slate-400">গ্রাহকদের তালিকা, সেগমেন্টেশন (নতুন, নিয়মিত, VIP) এবং রিস্ক ইন্ডিকেটর এখানে প্রদর্শিত হবে।</p>
      </div>
    </div>
  );
}