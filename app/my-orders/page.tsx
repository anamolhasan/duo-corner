'use client';
import { useState } from 'react';

export default function MyOrders() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  // কাস্টমার নম্বর দিয়ে অর্ডার খোঁজার ফাংশন
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    try {
      const res = await fetch('/api/save-order');
      const data = await res.json();
      if (Array.isArray(data)) {
        // শুধু ওই ফোন নম্বরের অর্ডারগুলো ফিল্টার করা
        const myOrders = data.filter((o: any) => (o.customerPhone || o.phone) === phone);
        setOrders(myOrders);
        setSearched(true);
      }
    } catch (error) {
      alert('ডেটা লোড করতে সমস্যা হয়েছে!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">অর্ডার ট্র্যাকিং</h1>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <input 
            type="text"
            placeholder="আপনার অর্ডার করা মোবাইল নম্বর দিন"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            required
          />
          <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl text-sm font-bold transition">
            আমার অর্ডার দেখুন
          </button>
        </form>

        {searched && (
          <div className="mt-6 space-y-3">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">এই নম্বরে কোনো অর্ডার পাওয়া যায়নি!</p>
            ) : (
              orders.map((order, index) => (
                <div key={index} className="border rounded-xl p-4 bg-gray-50 text-sm space-y-1">
                  <p className="font-bold text-rose-600">অর্ডার আইডি: {order.orderId || `ORD-${index + 1}`}</p>
                  <p className="text-gray-800 font-medium">প্রোডাক্ট: {order.productName || "Product"}</p>
                  <p className="text-gray-600">মূল্য: ৳{order.productPrice || order.amount}</p>
                  <div className="pt-2">
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                      স্ট্যাটাস: {order.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}