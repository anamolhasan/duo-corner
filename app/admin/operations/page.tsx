'use client';
import { useState } from 'react';

export default function OperationsAndAlerts() {
  const [activeTab, setActiveTab] = useState<'monitor' | 'alerts' | 'actions'>('monitor');

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* সাব-মেনু ট্যাব */}
        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
          <button 
            onClick={() => setActiveTab('monitor')} 
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'monitor' ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            1.2 Live Operations
          </button>
          <button 
            onClick={() => setActiveTab('alerts')} 
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'alerts' ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            1.3 Smart Alerts
          </button>
          <button 
            onClick={() => setActiveTab('actions')} 
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'actions' ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            1.4 Quick Actions
          </button>
        </div>

        {activeTab === 'monitor' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Live Operations Monitor</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-xl bg-amber-50 border-amber-200">
                <h4 className="font-bold text-amber-800">কুরিয়ার বুকিং ব্যর্থ</h4>
                <p className="text-xs text-amber-700 mt-1">Steadfast API কানেকশন চেক করুন। ২ টি অর্ডার পেন্ডিং আছে।</p>
              </div>
              <div className="p-4 border rounded-xl bg-rose-50 border-rose-200">
                <h4 className="font-bold text-rose-800">ডেলিভারি দেরি (Delayed)</h4>
                <p className="text-xs text-rose-700 mt-1">হাবের জ্যামের কারণে ১টি পার্সেল ডিলে হয়েছে।</p>
              </div>
              <div className="p-4 border rounded-xl bg-indigo-50 border-indigo-200">
                <h4 className="font-bold text-indigo-800">স্টক সমন্বয় বাকি</h4>
                <p className="text-xs text-indigo-700 mt-1">গতকালের রিটার্ন হওয়া আইটেম ইনভেন্টরিতে যোগ করতে হবে।</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Smart System Alerts</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                <span className="text-sm font-medium text-gray-800">⚠️ কম স্টক অ্যালার্ট: Magnetic Sun &amp; Moon Couple Bracelet (স্টক &lt; ৫ )</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-bold">Critical</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                <span className="text-sm font-medium text-gray-800">⚠️ কুরিয়ার পেমেন্ট সেটেলমেন্ট সময় পার হয়েছে (Steadfast COD)</span>
                <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold">Warning</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Quick Action Hub (1.4)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition text-sm">
                + নতুন পণ্য যোগ করুন
              </button>
              <button className="p-4 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl border border-amber-200 transition text-sm">
                + নতুন অর্ডার এন্ট্রি
              </button>
              <button className="p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl border border-emerald-200 transition text-sm">
                📦 কুরিয়ার বুকিং করুন
              </button>
              <button className="p-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 transition text-sm">
                💸 খরচ (Expense) যোগ করুন
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}