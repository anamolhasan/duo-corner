'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/save-order');
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data.reverse());
        }
      } catch (error) {
        console.error("অর্ডার লোড করতে সমস্যা হয়েছে", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ১-ক্লিকে Steadfast কুরিয়ারে অর্ডার পাঠানোর ফাংশন
  const handleSteadfastShipment = async (order: any) => {
    const orderId = order.orderId || `ORD-${Math.random()}`;
    if (!confirm(`আপনি কি "${order.customerName || order.name}" এর অর্ডারটি Steadfast কুরিয়ারে পাঠাতে চান?`)) {
      return;
    }

    setProcessingId(orderId);
    try {
      const res = await fetch('/api/admin/steadfast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const data = await res.json();

      if (data.success) {
        alert('সফল! অর্ডারটি Steadfast কুরিয়ারে এন্ট্রি হয়ে গেছে।');
      } else {
        alert('সমস্যা হয়েছে: ' + (data.message || 'কোড কাজ করছে না'));
      }
    } catch (err) {
      alert('সার্ভার কানেকশনে সমস্যা হয়েছে!');
    } finally {
      setProcessingId(null);
    }
  };

  const getDateColor = (dateStr: string) => {
    if (!dateStr) return 'bg-white';
    try {
      const dateOnly = new Date(dateStr).toISOString().split('T')[0];
      const charCode = dateOnly.charCodeAt(dateOnly.length - 1);
      const colors = [
        'bg-white', 
        'bg-blue-50/50', 
        'bg-emerald-50/50', 
        'bg-amber-50/50', 
        'bg-purple-50/50', 
        'bg-rose-50/50'
      ];
      return colors[charCode % colors.length];
    } catch {
      return 'bg-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-black text-gray-800 mb-6">Duo Corner Admin Dashboard</h1>
        
        {loading ? (
          <div className="text-center py-10 text-rose-500 font-bold">অর্ডার লোড হচ্ছে...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400">কোনো অর্ডার পাওয়া যায়নি!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-sm text-gray-500 bg-gray-50">
                  <th className="py-3 px-4">তারিখ ও সময়</th>
                  <th className="py-3 px-4">অর্ডার আইডি</th>
                  <th className="py-3 px-4">কাস্টমার তথ্য</th>
                  <th className="py-3 px-4">প্রোডাক্ট ও ঠিকানা</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4">কুরিয়ার</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const rowBg = getDateColor(order.date || order.Timestamp);
                  const currentId = order.orderId || `ORD-${index + 1}`;
                  const isProcessing = processingId === currentId;

                  return (
                    <tr key={index} className={`border-b transition hover:opacity-90 text-sm ${rowBg}`}>
                      <td className="py-4 px-4 text-xs text-gray-500 font-medium">
                        {order.date || order.Timestamp ? new Date(order.date || order.Timestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="py-4 px-4 font-bold text-rose-600">{currentId}</td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-800">{order.customerName || order.name}</p>
                        <p className="text-gray-500 text-xs">{order.customerPhone || order.phone}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-800">{order.productName || "Product"} (৳{order.productPrice || order.amount})</p>
                        <p className="text-gray-500 text-xs">{order.customerAddress || order.address}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => handleSteadfastShipment(order)}
                          disabled={isProcessing}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {isProcessing ? 'পাঠানো হচ্ছে...' : 'Steadfast Send'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}