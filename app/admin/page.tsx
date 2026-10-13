'use client';
import { useState, useEffect } from 'react';
import { useUser, useClerk, SignedIn, SignedOut, SignIn } from '@clerk/nextjs';

type Order = {
  id?: string | number;
  Timestamp?: string;
  name?: string;
  Name?: string;
  phone?: string;
  Phone?: string;
  productName?: string;
  note?: string;
  'Product/Note'?: string;
  quantity?: number;
  address?: string;
  Address?: string;
  thana?: string;
  district?: string;
  totalPrice?: number;
  amount?: number;
  Amount?: number;
  status?: string;
  Status?: string;
};

export default function AdminDashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'upload' | 'categories'>('orders');

  const [newProduct, setNewProduct] = useState({
    productName: '',
    category: 'ব্রেসলেট (Bracelet)',
    price: '',
    stock: '',
    description: '',
    imageUrl: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const fetchOrders = async (): Promise<Order[]> => {
    try {
      const res = await fetch('/api/save-order');
      const data = await res.json();
      return Array.isArray(data) ? (data as Order[]) : [];
    } catch {
      return [];
    }
  };

  const refreshOrders = async () => {
    setLoading(true);
    setOrders(await fetchOrders());
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    void fetchOrders().then((data) => {
      if (!active) return;
      setOrders(data);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const handleStatusChange = async (orderId: string | number, newStatus: string) => {
    alert(`অর্ডার ${orderId} এর স্ট্যাটাস "${newStatus}" করা হয়েছে!`);
    setOrders(orders.map(order => 
      (order.id === orderId || `ORD-${orders.indexOf(order) + 1}` === orderId) 
        ? { ...order, status: newStatus, Status: newStatus } 
        : order
    ));
  };

  const sendToSteadfast = async (order: Order, index: number) => {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই অর্ডারটি Steadfast কুরিয়ারে পাঠাতে চান?')) return;
    const orderId = order.id || `ORD-${index + 1}`;
    setActionLoading(orderId);
    try {
      const res = await fetch('/api/save-order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          name: order.name || order.Name || "Unknown",
          phone: order.phone || order.Phone || "",
          address: order.address || order.Address || "",
          thana: order.thana || "",
          district: order.district || "",
          totalPrice: order.totalPrice || order.amount || order.Amount || 0,
          productName: order.productName || order.note || order['Product/Note'] || "Product"
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ সফল! কনসাইনমেন্ট আইডি: ${data.consignmentId}`);
      } else {
        alert(`❌ ব্যর্থ হয়েছে: ${data.error}`);
      }
    } catch (err) {
      alert('সার্ভার এরর!');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUploadProduct = async () => {
    if (!newProduct.productName || !newProduct.price) {
      alert("দয়া করে প্রোডাক্টের নাম এবং দাম লিখুন!");
      return;
    }
    setIsUploading(true);
    try {
      const formattedImages = newProduct.imageUrl
        ? newProduct.imageUrl.split(',').map(img => img.trim()).filter(Boolean).join(', ')
        : 'parl.jpg, parl1.jpg, parl2.jpg';

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          imageUrl: formattedImages
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ প্রোডাক্ট সফলভাবে আপলোড হয়েছে!");
        setNewProduct({ productName: '', category: 'ব্রেসলেট (Bracelet)', price: '', stock: '', description: '', imageUrl: '' });
      } else {
        alert("❌ আপলোড ব্যর্থ হয়েছে!");
      }
    } catch (err) {
      alert("সার্ভার এরর!");
    }
    setIsUploading(false);
  };

  const adminEmail = "mdimranatick@gmail.com";
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();

  return (
    <>
      {/* ১. লগইন করা না থাকলে সরাসরি আইডি ও পাসওয়ার্ড দিয়ে সাইন ইন ফর্ম দেখাবে */}
      <SignedOut>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-black text-gray-800">Duo Corner Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে আপনার আইডি ও পাসওয়ার্ড দিয়ে সাইন ইন করুন</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <SignIn routing="hash" />
          </div>
        </div>
      </SignedOut>

      {/* ২. লগইন করা থাকলে মূল ড্যাশবোর্ড দেখাবে */}
      <SignedIn>
        {userEmail !== adminEmail ? (
          <div className="flex h-screen flex-col items-center justify-center bg-rose-50 p-6 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-2">দুঃখিত! 🚫</h1>
            <p className="text-gray-700 mb-4">এই পেজটি শুধুমাত্র Duo Corner-এর অ্যাডমিনের জন্য।</p>
            <button 
              onClick={() => signOut()}
              className="bg-rose-600 text-white font-bold px-6 py-2.5 rounded-xl shadow hover:bg-rose-700 transition cursor-pointer"
            >
              লগআউট করুন
            </button>
          </div>
        ) : (
          <main className="min-h-screen bg-gray-50/60 p-4 md:p-8 font-sans text-gray-900">
            <div className="max-w-7xl mx-auto">
              
              {/* হেডার এবং লগআউট বাটন */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="bg-pink-100 text-pink-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    👑 Admin Control Panel
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-2">Duo Corner Dashboard</h1>
                  <p className="text-xs text-gray-500 mt-1">লগইন করা অ্যাডমিন: <span className="font-bold text-gray-700">{userEmail}</span></p>
                </div>
                
                <button 
                  onClick={() => signOut()}
                  className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2.5 rounded-xl text-xs font-extrabold border border-rose-200 transition cursor-pointer shadow-sm"
                >
                  লগআউট / Sign Out
                </button>
              </div>

              {/* ট্যাব নেভিগেশন */}
              <div className="bg-white px-6 pt-4 rounded-3xl shadow-sm border border-gray-100 mb-6">
                <div className="flex gap-4 border-b border-gray-200 pb-2 overflow-x-auto">
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`pb-2 px-2 font-bold transition-all cursor-pointer ${activeTab === 'orders' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500 hover:text-rose-500'}`}
                  >
                    📦 অর্ডার ড্যাশবোর্ড
                  </button>
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className={`pb-2 px-2 font-bold transition-all cursor-pointer ${activeTab === 'upload' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500 hover:text-rose-500'}`}
                  >
                    ➕ প্রোডাক্ট আপলোড
                  </button>
                  <button 
                    onClick={() => setActiveTab('categories')}
                    className={`pb-2 px-2 font-bold transition-all cursor-pointer ${activeTab === 'categories' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500 hover:text-rose-500'}`}
                  >
                    📑 ক্যাটাগরি ম্যানেজমেন্ট
                  </button>
                </div>
              </div>

              {activeTab === 'orders' && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 flex justify-end">
                    <button onClick={refreshOrders} className="bg-rose-50 text-rose-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-rose-100 transition cursor-pointer">
                      🔄 রিফ্রেশ করুন
                    </button>
                  </div>
                  {loading ? (
                    <div className="text-center py-20 text-gray-500 font-medium">অর্ডার লোড হচ্ছে...</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-medium">কোনো অর্ডার পাওয়া যায়নি!</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100 font-extrabold">
                            <th className="p-4">অর্ডার আইডি</th>
                            <th className="p-4">কাস্টমার তথ্য</th>
                            <th className="p-4">প্রোডাক্ট ও ঠিকানা</th>
                            <th className="p-4">স্ট্যাটাস</th>
                            <th className="p-4 text-center">কুরিয়ার</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {orders.map((order, index) => {
                            const currentId = order.id || `ORD-${index + 1}`;
                            const currentStatus = order.status || order.Status || "Pending";
                            return (
                              <tr key={index} className="hover:bg-pink-50/30">
                                <td className="p-4 font-bold text-pink-600">{currentId}</td>
                                <td className="p-4">
                                  <span className="font-bold block">{order.name || order.Name}</span>
                                  <span className="text-gray-500 text-xs">{order.phone || order.Phone}</span>
                                </td>
                                <td className="p-4">
                                  <span className="font-semibold block">{order.productName || order.note || order['Product/Note']}</span>
                                  <span className="text-gray-500 text-xs block">{order.address || order.Address}</span>
                                </td>
                                <td className="p-4">
                                  <select 
                                    value={currentStatus}
                                    onChange={(e) => handleStatusChange(currentId, e.target.value)}
                                    className={`text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none cursor-pointer
                                      ${currentStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                        currentStatus === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                        'bg-green-50 text-green-700 border-green-200'}`}
                                  >
                                    <option value="Pending">⏳ Pending</option>
                                    <option value="Processing">⚙️ Processing</option>
                                    <option value="Shipped">📦 Shipped</option>
                                  </select>
                                </td>
                                <td className="p-4 text-center">
                                  <button
                                    onClick={() => sendToSteadfast(order, index)}
                                    disabled={actionLoading === currentId}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow text-xs disabled:opacity-50 cursor-pointer"
                                  >
                                    {actionLoading === currentId ? 'পাঠানো হচ্ছে...' : '🚚 Steadfast'}
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
              )}

              {activeTab === 'upload' && (
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">
                  <h2 className="text-2xl font-black text-gray-800 mb-6">নতুন প্রোডাক্ট যোগ করুন</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">প্রোডাক্টের নাম</label>
                      <input type="text" value={newProduct.productName} onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})} placeholder="যেমন: Magnetic Sun Moon Bracelet" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">ক্যাটাগরি</label>
                      <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 cursor-pointer">
                        <option>ব্রেসলেট (Bracelet)</option>
                        <option>নেকলেস (Necklace)</option>
                        <option>স্মার্ট ওয়াচ (Smart Watch)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">দাম (টাকায়)</label>
                      <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="যেমন: 750" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">স্টক সংখ্যা (Inventory)</label>
                      <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} placeholder="যেমন: 50" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">ডেসক্রিপশন বা বিবরণ</label>
                      <textarea 
                        rows={4} 
                        value={newProduct.description} 
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} 
                        placeholder="প্রোডাক্টের সুন্দর একটি বিবরণ লিখুন..." 
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500"
                      ></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">প্রোডাক্টের ছবির নাম/লিংক (কমা দিয়ে একাধিক দিন)</label>
                      <input type="text" value={newProduct.imageUrl} onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})} placeholder="যেমন: parl.jpg, parl1.jpg, parl2.jpg" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500" />
                      <p className="text-xs text-gray-500 mt-2">একাধিক ছবি দিতে চাইলে কমা (,) ব্যবহার করুন। যেমন: <code>parl.jpg, parl1.jpg, parl2.jpg</code></p>
                    </div>
                  </div>
                  <button 
                    onClick={handleUploadProduct} 
                    disabled={isUploading}
                    className="mt-8 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg transition text-lg disabled:opacity-50 cursor-pointer"
                  >
                    {isUploading ? 'প্রোডাক্ট সেভ হচ্ছে...' : '💾 প্রোডাক্ট সেভ করুন'}
                  </button>
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 text-center py-20">
                  <h2 className="text-2xl font-black text-gray-800 mb-2">ক্যাটাগরি ম্যানেজমেন্ট</h2>
                  <p className="text-gray-500">খুব শিগগিরই আমরা এখানে ক্যাটাগরি যোগ করার অপশন চালু করব!</p>
                </div>
              )}

            </div>
          </main>
        )}
      </SignedIn>
    </>
  );
}