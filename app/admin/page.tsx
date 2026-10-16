'use client';
import { useState, useEffect } from 'react';

type Order = {
  id?: string | number;
  Timestamp?: string;
  Date?: string;
  date?: string;
  name?: string;
  Name?: string;
  customerName?: string;
  phone?: string;
  Phone?: string;
  customerPhone?: string;
  Number?: string;
  number?: string;
  productName?: string;
  note?: string;
  'Product/Note'?: string;
  address?: string;
  Address?: string;
  totalPrice?: number;
  amount?: number;
  Amount?: number;
  productPrice?: number;
  collectionAmount?: number;
  'Collection Amount'?: number;
  status?: string;
  Status?: string;
  trackingCode?: string;
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  
  // নতুন সাইডবার ট্যাব নেভিগেশন স্টেট
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'inventory' | 'customers' | 'marketing' | 'settlements' | 'automation' | 'reports' | 'staff' | 'cms' | 'system' | 'settings'
  >('orders');
  
  const [searchTerm, setSearchTerm] = useState('');

  // গুগল শিট থেকে রিয়েল-টাইম অর্ডার ফেচ করা
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/save-order');
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error('Data fetch error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Steadfast কুরিয়ারে অর্ডার পাঠানোর ফাংশন এবং স্ট্যাটাস আপডেট
  const handleCourierBooking = async (order: Order, index: number) => {
    const orderId = `DC-${index + 1}`;
    setBookingLoading(orderId);

    // ১. ফোন নম্বর থেকে শুধু সংখ্যা ও শূন্য (0) নিশ্চিত করা
    let rawPhone = String(order.phone || order.Phone || order.customerPhone || order.Number || order.number || '');
    let formattedPhone = rawPhone.replace(/\D/g, '');
    if (formattedPhone.length === 10 && !formattedPhone.startsWith('0')) {
      formattedPhone = '0' + formattedPhone;
    }

    // ২. টাকার অংক থেকে শুধুমাত্র খাঁটি সংখ্যা বের করা
    let rawAmount = String(order.amount || order.Amount || order.productPrice || order.collectionAmount || order['Collection Amount'] || '0');
    let cleanAmount = Number(rawAmount.replace(/[^\d]/g, '')) || 0;

    let customerName = order.name || order.Name || order.customerName || 'Customer';
    let customerAddress = order.address || order.Address || '';

    try {
      const res = await fetch('/api/save-order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          name: customerName,
          phone: formattedPhone,
          address: customerAddress,
          totalPrice: cleanAmount
        })
      });

      const result = await res.json();
      if (result.success) {
        alert(`সফল! কুরিয়ার সিরিয়াল আইডি (CN): ${result.consignmentId}`);
        
        // কুরিয়ারে এন্ট্রি সফল হওয়ার পর লোকাল স্টেট আপডেট করে স্ট্যাটাস 'Booked' করা
        setOrders(prevOrders => {
          const updated = [...prevOrders];
          updated[index] = {
            ...updated[index],
            status: 'Booked',
            Status: 'Booked',
            trackingCode: result.consignmentId
          };
          return updated;
        });

      } else {
        alert(`বুকিং ব্যর্থ: ${result.error}`);
      }
    } catch (err) {
      alert('কুরিয়ার বুকিং করার সময় সার্ভার ত্রুটি হয়েছে!');
    } finally {
      setBookingLoading(null);
    }
  };

  // ড্যাশবোর্ড মেট্রিক্স হিসাব
  const totalOrders = orders.length;
  const totalSales = orders.reduce((acc, o) => {
    let amt = String(o.amount || o.Amount || o.productPrice || o.collectionAmount || o['Collection Amount'] || '0');
    return acc + (Number(amt.replace(/[^\d]/g, '')) || 0);
  }, 0);
  
  const pendingCount = orders.filter(o => {
    let st = String(o.status || o.Status || 'Pending');
    return st.toLowerCase() === 'pending';
  }).length;

  const filteredOrders = orders.filter(order => {
    const name = String(order.name || order.Name || order.customerName || '').toLowerCase();
    const phone = String(order.phone || order.Phone || order.customerPhone || order.Number || order.number || '');
    return name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm);
  });

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 font-sans">
        <div className="bg-slate-900 border border-[#D4AF37]/40 rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase">DUO CORNER SYSTEM</p>
          <h3 className="text-white font-bold text-lg mt-2">Loading Order Data... ✨</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* সাইডবার মেনু ও ট্যাব নেভিগেশন */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="mb-8 px-2">
            <h2 className="text-xl font-black text-white tracking-wider">DUO CORNER</h2>
            <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest mt-0.5">Smart Commerce System</p>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'overview' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              📊 Overview Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'orders' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              📦 Orders & Processing ({orders.length})
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'inventory' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              🏷️ Products & Inventory
            </button>
            <button 
              onClick={() => setActiveTab('customers')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'customers' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              👥 Customer & Risk
            </button>
            <button 
              onClick={() => setActiveTab('marketing')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'marketing' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              📈 Marketing & Pixels
            </button>
            <button 
              onClick={() => setActiveTab('settlements')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'settlements' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              💰 Payments & COD
            </button>
            <button 
              onClick={() => setActiveTab('automation')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'automation' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              ⚡ Automation Rules
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'reports' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              📑 Professional Reports
            </button>
            <button 
              onClick={() => setActiveTab('staff')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'staff' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              🔐 Staff & Permissions
            </button>
            <button 
              onClick={() => setActiveTab('cms')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'cms' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              🌐 Website & CMS
            </button>
            <button 
              onClick={() => setActiveTab('system')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'system' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              ⚙️ System Health
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'settings' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              🛠️ Business Settings
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500">
          <p>System Status: <span className="text-emerald-400 font-bold">● Online</span></p>
        </div>
      </aside>

      {/* মূল কন্টেন্ট এরিয়া */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        {/* টপ হেডার */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Duo Corner Operations Center
            </span>
            <h1 className="text-2xl font-black text-white mt-2">Business Overview & Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-rose-500/10 text-rose-400 px-4 py-2 rounded-xl text-sm font-bold border border-rose-500/20">
              Total Orders: {totalOrders}
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-500/20">
              Total Sales: {totalSales.toLocaleString()}
            </div>
          </div>
        </div>

        {/* ট্যাব অনুযায়ী কন্টেন্ট রেন্ডারিং */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Pending</p>
                <h3 className="text-xl font-black text-amber-500 mt-1">{pendingCount}</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Processing</p>
                <h3 className="text-xl font-black text-blue-500 mt-1">0</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Shipped</p>
                <h3 className="text-xl font-black text-indigo-500 mt-1">0</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Delivered</p>
                <h3 className="text-xl font-black text-emerald-500 mt-1">0</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Cancelled</p>
                <h3 className="text-xl font-black text-rose-500 mt-1">0</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Returned</p>
                <h3 className="text-xl font-black text-purple-500 mt-1">0</h3>
              </div>
            </div>
          </div>
        )}

        {/* মূল অর্ডার প্রসেসিং টেবিল ট্যাব */}
        {activeTab === 'orders' && (
          <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden space-y-4">
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Recent Orders (Google Sheet Synced)</h3>
                <span className="text-xs text-slate-400">Real-time Connected</span>
              </div>
              <input 
                type="text" 
                placeholder="🔍 নাম বা ফোন দিয়ে খুঁজুন..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-rose-500 w-full sm:w-64"
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold">Order ID</th>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold">Name</th>
                    <th className="p-4 font-bold">Number</th>
                    <th className="p-4 font-bold">Collection Amount</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-center">Courier Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500">No orders found!</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, idx) => {
                      let rawPhone = String(order.phone || order.Phone || order.customerPhone || order.Number || order.number || '');
                      let formattedPhone = rawPhone.replace(/\D/g, '');
                      if (formattedPhone.length === 10 && !formattedPhone.startsWith('0')) {
                        formattedPhone = '0' + formattedPhone;
                      }

                      let rawAmount = String(order.amount || order.Amount || order.productPrice || order.collectionAmount || order['Collection Amount'] || '0');
                      let cleanAmount = Number(rawAmount.replace(/[^\d]/g, '')) || 0;

                      let cName = order.name || order.Name || order.customerName || 'Unknown Customer';
                      let cStatus = order.status || order.Status || 'Pending';
                      let cDate = order.Timestamp || order.Date || order.date;

                      const isBooked = cStatus.toLowerCase() === 'booked';

                      return (
                        <tr key={idx} className="hover:bg-slate-800/50 transition">
                          <td className="p-4 font-bold text-rose-500">ORD-{idx + 1}</td>
                          <td className="p-4 text-slate-400 text-xs">{cDate ? new Date(cDate).toLocaleDateString() : 'N/A'}</td>
                          <td className="p-4 font-bold text-white">{cName}</td>
                          <td className="p-4 text-slate-300">{formattedPhone || 'No Number'}</td>
                          <td className="p-4 text-white font-medium">{cleanAmount}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              isBooked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {cStatus}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleCourierBooking(order, idx)}
                              disabled={bookingLoading === `DC-${idx + 1}` || isBooked}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                                isBooked 
                                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed' 
                                  : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                              }`}
                            >
                              {bookingLoading === `DC-${idx + 1}` ? 'Booking...' : (isBooked ? '✅ Booked' : '🚚 Steadfast')}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* অন্যান্য মডিউল বা ট্যাবগুলোর বেসিক ইন্টারফেস */}
        {activeTab === 'inventory' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-black text-white mb-2">🏷️ Products & Inventory Management</h2>
            <p className="text-xs text-slate-400">স্টক কন্ট্রোল ও প্রোডাক্ট ভ্যারিয়েন্ট ম্যানেজমেন্টের ড্যাশবোর্ড।</p>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-black text-white mb-2">👥 Customer & Fraud Risk Management</h2>
            <p className="text-xs text-slate-400">গ্রাহক প্রোফাইল ও রিস্ক ইন্ডিকেটর তালিকা।</p>
          </div>
        )}

        {activeTab === 'marketing' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-black text-white mb-2">📈 Marketing, Pixels & Server-Side Tracking</h2>
            <p className="text-xs text-slate-400">Meta CAPI, GA4 এবং TikTok পিক্সেল মনিটরিং।</p>
          </div>
        )}

        {activeTab === 'settlements' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-black text-white mb-2">💰 Payment & Courier COD Settlement Center</h2>
            <p className="text-xs text-slate-400">কুরিয়ার সেটেলমেন্ট এবং পেমেন্ট রিকনসিলিয়েশন।</p>
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-black text-white mb-2">⚡ Business Automation & Rules Engine</h2>
            <p className="text-xs text-slate-400">অটোমেশন ট্রিগার ও ওয়ার্কফ্লো কনফিগারেশন।</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-black text-white mb-2">📑 Professional Reports & Business Intelligence</h2>
            <p className="text-xs text-slate-400">লাভ-ক্ষতি এবং কুরিয়ার পারফরম্যান্স রিপোর্ট।</p>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-black text-white mb-2">🔐 Staff, Permissions & Approval Center</h2>
            <p className="text-xs text-slate-400">রোল-ভিত্তিক পারমিশন এবং অ্যাক্টিভিটি লগ।</p>
          </div>
        )}

        {activeTab === 'cms' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-black text-white mb-2">🌐 Website & Content Management (CMS)</h2>
            <p className="text-xs text-slate-400">ব্যানার, ক্যাটাগরি ও এসইও সেটিংস।</p>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-black text-white mb-2">⚙️ Integration, API & System Health Center</h2>
            <p className="text-xs text-slate-400">এপিআই কি, ওয়েবহুক এবং সিস্টেম স্ট্যাটাস।</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-black text-white mb-2">🛠️ Business Settings & Future Expansion</h2>
            <p className="text-xs text-slate-400">ডেলিভারি রুলস, কারেন্সি এবং গ্লোবাল সেটিংস।</p>
          </div>
        )}

      </main>
    </div>
  );
}