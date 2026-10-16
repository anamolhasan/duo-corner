'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

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
  const handleCourierBooking = async (order: any, index: number) => {
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
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* টপ হেডার ও বিজনেস ওভারভিউ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Duo Corner Operations Center
            </span>
            <h1 className="text-2xl font-black text-gray-900 mt-2">Business Overview & Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-sm font-bold border border-rose-100">
              Total Orders: {totalOrders}
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100">
              Total Sales: {totalSales.toLocaleString()}
            </div>
          </div>
        </div>

        {/* কেপিআই কার্ড */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Pending</p>
            <h3 className="text-xl font-black text-amber-600 mt-1">{pendingCount}</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Processing</p>
            <h3 className="text-xl font-black text-blue-600 mt-1">0</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Shipped</p>
            <h3 className="text-xl font-black text-indigo-600 mt-1">0</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Delivered</p>
            <h3 className="text-xl font-black text-emerald-600 mt-1">0</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Cancelled</p>
            <h3 className="text-xl font-black text-rose-600 mt-1">0</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Returned</p>
            <h3 className="text-xl font-black text-purple-600 mt-1">0</h3>
          </div>
        </div>

        {/* অর্ডার টেবিল */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Recent Orders (Google Sheet Synced)</h3>
            <span className="text-xs text-gray-400">Real-time Connected</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Number</th>
                  <th className="p-4 font-bold">Collection Amount</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-center">Courier Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">No orders found!</td>
                  </tr>
                ) : (
                  orders.map((order, idx) => {
                    // ১. ফোন নম্বর ফরম্যাটিং
                    let rawPhone = String(order.phone || order.Phone || order.customerPhone || order.Number || order.number || '');
                    let formattedPhone = rawPhone.replace(/\D/g, '');
                    if (formattedPhone.length === 10 && !formattedPhone.startsWith('0')) {
                      formattedPhone = '0' + formattedPhone;
                    }

                    // ২. টাকার অংক থেকে শুধুমাত্র সংখ্যা বের করার পারফেক্ট লজিক
                    let rawAmount = String(order.amount || order.Amount || order.productPrice || order.collectionAmount || order['Collection Amount'] || '0');
                    let cleanAmount = Number(rawAmount.replace(/[^\d]/g, '')) || 0;

                    // ৩. নাম ও স্ট্যাটাস
                    let cName = order.name || order.Name || order.customerName || 'Unknown Customer';
                    let cStatus = order.status || order.Status || 'Pending';
                    let cDate = order.Timestamp || order.Date || order.date;

                    // স্ট্যাটাস অনুযায়ী ডাইনামিক স্টাইল ও কালার
                    const isBooked = cStatus.toLowerCase() === 'booked';

                    return (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-bold text-rose-600">ORD-{idx + 1}</td>
                        <td className="p-4 text-gray-500 text-xs">{cDate ? new Date(cDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-4 font-bold text-gray-900">{cName}</td>
                        <td className="p-4 text-gray-700">{formattedPhone || 'No Number'}</td>
                        
                        {/* টেবিলের ঘরে শুধুমাত্র খাঁটি সংখ্যাটি শো করবে */}
                        <td className="p-4 text-gray-900 font-medium">{cleanAmount}</td>

                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isBooked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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
                                ? 'bg-emerald-600 text-white cursor-not-allowed' 
                                : 'bg-rose-600 hover:bg-rose-700 text-white'
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

      </div>
    </div>
  );
}