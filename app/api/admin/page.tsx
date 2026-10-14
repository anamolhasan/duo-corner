'use client';
import { useState, useEffect } from 'react';
import { useUser, useClerk, SignIn } from '@clerk/nextjs';

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
  division?: string;
  totalPrice?: number;
  amount?: number;
  Amount?: number;
  status?: string;
  Status?: string;
  paymentMethod?: string;
};

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'finance' | 'impact' | 'upload' | 'categories'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // নতুন প্রোডাক্ট স্টেট (আপনার গুগল শিটের কলাম অনুযায়ী আলাদা ৪টি ছবি, ডুয়েল প্রাইস, ভিডিও ও ৬টি স্পেসিফিকেশন)
  const [newProduct, setNewProduct] = useState({
    productName: '',
    category: 'ব্রেসলেট (Bracelet)',
    regularPrice: '',
    offerPrice: '',
    stock: '',
    description: '',
    imageUrl1: 'parl.jpg',
    imageUrl2: 'parl1.jpg',
    imageUrl3: 'parl2.jpg',
    imageUrl4: 'parl3.jpg',
    videoUrl: '/video.mp4',
    specs: [
      { label: 'Product Type', value: '' },
      { label: 'Design', value: '' },
      { label: 'Material', value: '' },
      { label: 'Color', value: '' },
      { label: 'Size', value: '' },
      { label: 'Origin', value: '' }
    ]
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
    } catch {
      alert('সার্ভার এরর!');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    const updatedSpecs = [...newProduct.specs];
    updatedSpecs[index][field] = val;
    setNewProduct({ ...newProduct, specs: updatedSpecs });
  };

  const handleUploadProduct = async () => {
    if (!newProduct.productName || !newProduct.offerPrice) {
      alert("দয়া করে প্রোডাক্টের নাম এবং অফার প্রাইস লিখুন!");
      return;
    }
    setIsUploading(true);
    try {
      const validAttributes = newProduct.specs.filter(s => s.label.trim() && s.value.trim());

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: "add_product",
          productName: newProduct.productName,
          category: newProduct.category,
          regularPrice: Number(newProduct.regularPrice) || Number(newProduct.offerPrice),
          price: Number(newProduct.offerPrice),
          stock: Number(newProduct.stock) || 100,
          description: newProduct.description,
          imageUrl1: newProduct.imageUrl1 || 'parl.jpg',
          imageUrl2: newProduct.imageUrl2 || 'parl1.jpg',
          imageUrl3: newProduct.imageUrl3 || 'parl2.jpg',
          imageUrl4: newProduct.imageUrl4 || 'parl3.jpg',
          videoUrl: newProduct.videoUrl || '/video.mp4',
          attributes: JSON.stringify(validAttributes)
        })
      });
      const data = await res.json();
      if (data.success || data.status === "success") {
        alert("✅ প্রোডাক্ট সফলভাবে আপলোড এবং গুগল শিটে সেভ হয়েছে!");
        setNewProduct({
          productName: '',
          category: 'ব্রেসলেট (Bracelet)',
          regularPrice: '',
          offerPrice: '',
          stock: '',
          description: '',
          imageUrl1: 'parl.jpg',
          imageUrl2: 'parl1.jpg',
          imageUrl3: 'parl2.jpg',
          imageUrl4: 'parl3.jpg',
          videoUrl: '/video.mp4',
          specs: [
            { label: 'Product Type', value: '' },
            { label: 'Design', value: '' },
            { label: 'Material', value: '' },
            { label: 'Color', value: '' },
            { label: 'Size', value: '' },
            { label: 'Origin', value: '' }
          ]
        });
      } else {
        alert("❌ আপলোড ব্যর্থ হয়েছে!");
      }
    } catch {
      alert("সার্ভার এরর!");
    }
    setIsUploading(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-rose-500 font-bold text-lg animate-pulse">লোড হচ্ছে...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black text-white">Duo Corner Admin Panel</h1>
          <p className="text-xs text-slate-400 mt-1">অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে আপনার আইডি দিয়ে সাইন ইন করুন</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-3xl shadow-xl border border-slate-800">
          <SignIn routing="hash" />
        </div>
      </div>
    );
  }

  const adminEmail = "mdimranatick@gmail.com";
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();

  if (userEmail !== adminEmail) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
        <h1 className="text-3xl font-bold text-rose-500 mb-2">দুঃখিত! 🚫</h1>
        <p className="text-slate-400 mb-4">এই পেজটি শুধুমাত্র Duo Corner-এর অ্যাডমিনের জন্য সুরক্ষিত।</p>
        <button 
          onClick={() => signOut()}
          className="bg-rose-600 text-white font-bold px-6 py-2.5 rounded-xl shadow hover:bg-rose-700 transition cursor-pointer"
        >
          লগআউট করুন
        </button>
      </div>
    );
  }

  const totalSales = orders.reduce((acc, curr) => acc + (Number(curr.totalPrice) || Number(curr.amount) || Number(curr.Amount) || 0), 0);
  const totalOrders = orders.length;
  const mealFundTotal = totalOrders * 10;

  const filteredOrders = orders.filter(order => 
    (order.name || order.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.phone || order.Phone || '').includes(searchTerm) ||
    (order.district || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* ১. সাইডবার নেভিগেশন */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between">
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
              onClick={() => setActiveTab('upload')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'upload' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              ➕ Upload New Product
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'categories' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              📑 Categories
            </button>
            <button 
              onClick={() => setActiveTab('finance')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'finance' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              💰 Accounts & Finance
            </button>
            <button 
              onClick={() => setActiveTab('impact')}
              className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'impact' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              🥀 Social Impact & Meal Fund
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500">
          <p>System Status: <span className="text-emerald-400 font-bold">● Online</span></p>
          <button onClick={() => signOut()} className="mt-3 w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-2 rounded-xl transition cursor-pointer">
            লগআউট করুন
          </button>
        </div>
      </aside>

      {/* ২. মূল কন্টেন্ট এরিয়া */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-8 gap-4">
          <div className="w-full sm:w-80">
            <input 
              type="text" 
              placeholder="🔍 গ্রাহকের নাম, ফোন বা জেলা দিয়ে খুঁজুন..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshOrders}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer border border-slate-700"
            >
              🔄 রিফ্রেশ
            </button>
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold px-3.5 py-2.5 rounded-xl">
              👑 Master Admin
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                <p className="text-xs text-slate-400 font-semibold mb-1">মোট বিক্রয় (Total Sales)</p>
                <h3 className="text-2xl font-black text-white">৳{totalSales}</h3>
                <span className="text-[10px] text-emerald-400 mt-2 inline-block font-bold">↑ রিয়েল-টাইম হিসাব</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                <p className="text-xs text-slate-400 font-semibold mb-1">মোট অর্ডার (Total Orders)</p>
                <h3 className="text-2xl font-black text-white">{totalOrders} টি</h3>
                <span className="text-[10px] text-rose-400 mt-2 inline-block font-bold">ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                <p className="text-xs text-slate-400 font-semibold mb-1">সামাজিক ফান্ড (Meal Fund)</p>
                <h3 className="text-2xl font-black text-amber-400">৳{mealFundTotal}</h3>
                <span className="text-[10px] text-amber-300 mt-2 inline-block font-bold">দুস্থদের খাদ্য সহায়তা</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                <p className="text-xs text-slate-400 font-semibold mb-1">সিস্টেম সিকিউরিটি</p>
                <h3 className="text-xl font-black text-emerald-400 mt-1">Clerk 2FA</h3>
                <span className="text-[10px] text-slate-400 mt-2 inline-block font-bold">সুরক্ষিত এনভায়রনমেন্ট</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">সকল অর্ডার প্রসেসিং তালিকা ({filteredOrders.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-3">অর্ডার আইডি</th>
                    <th className="p-3">ক্রেতা ও মোবাইল</th>
                    <th className="p-3">পণ্য ও ঠিকানা</th>
                    <th className="p-3">মূল্য</th>
                    <th className="p-3 text-right">কুরিয়ার অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOrders.map((order, idx) => {
                    const currentId = order.id || `ORD-${idx + 1}`;
                    return (
                      <tr key={idx} className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-rose-400">{currentId}</td>
                        <td className="p-3">
                          <p className="font-bold text-white text-sm">{order.name || order.Name}</p>
                          <p className="text-rose-400 font-semibold">{order.phone || order.Phone}</p>
                        </td>
                        <td className="p-3 text-slate-300 text-[11px]">
                          <p className="font-semibold text-white">{order.productName || order.note}</p>
                          {order.address || order.Address}, {order.thana}, {order.district}
                        </td>
                        <td className="p-3 font-black text-white">৳{order.totalPrice || order.amount || order.Amount}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => sendToSteadfast(order, idx)}
                            disabled={actionLoading === currentId}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer shadow-sm"
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
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">🏷️ Products & Inventory Management</h3>
            <button onClick={() => setActiveTab('upload')} className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow cursor-pointer">
              + নতুন প্রোডাক্ট আপলোড করুন
            </button>
          </div>
        )}

        {/* Upload New Product Tab (আপনার এক্সেল কলামের সাথে ১০০% সামঞ্জস্যপূর্ণ) */}
        {activeTab === 'upload' && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-xl font-black text-white mb-2">নতুন প্রোডাক্ট আপলোড করুন</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">প্রোডাক্টের নাম *</label>
                <input type="text" value={newProduct.productName} onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})} placeholder="যেমন: Magnetic Sun Moon Bracelet" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">ক্যাটাগরি</label>
                <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500 cursor-pointer">
                  <option>ব্রেসলেট (Bracelet)</option>
                  <option>নেকলেস (Necklace)</option>
                  <option>স্মার্ট ওয়াচ (Smart Watch)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">রেগুলার প্রাইস (Regular Price - কাটা মূল্য)</label>
                <input type="number" value={newProduct.regularPrice} onChange={(e) => setNewProduct({...newProduct, regularPrice: e.target.value})} placeholder="যেমন: 999" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">অফার প্রাইস (Offer Price - বিক্রয় মূল্য) *</label>
                <input type="number" value={newProduct.offerPrice} onChange={(e) => setNewProduct({...newProduct, offerPrice: e.target.value})} placeholder="যেমন: 799" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">স্টক সংখ্যা (Inventory)</label>
                <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} placeholder="যেমন: 100" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">ভিডিও ইউআরএল (Video URL)</label>
                <input type="text" value={newProduct.videoUrl} onChange={(e) => setNewProduct({...newProduct, videoUrl: e.target.value})} placeholder="যেমন: /video.mp4" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-2">ডেসক্রিপশন বা বিবরণ</label>
                <textarea rows={3} value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="প্রোডাক্টের সুন্দর বিবরণ..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500"></textarea>
              </div>

              {/* আলাদা ৪টি ছবির ইনপুট ঘর */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-black text-white sm:col-span-2 mb-1">🖼️ আলাদা ছবির ফাইলের নাম (Image URL 1 to 4)</h3>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Image URL 1</label>
                  <input type="text" value={newProduct.imageUrl1} onChange={(e) => setNewProduct({...newProduct, imageUrl1: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Image URL 2</label>
                  <input type="text" value={newProduct.imageUrl2} onChange={(e) => setNewProduct({...newProduct, imageUrl2: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Image URL 3</label>
                  <input type="text" value={newProduct.imageUrl3} onChange={(e) => setNewProduct({...newProduct, imageUrl3: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Image URL 4</label>
                  <input type="text" value={newProduct.imageUrl4} onChange={(e) => setNewProduct({...newProduct, imageUrl4: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>
            </div>

            {/* প্রোডাক্ট স্পেসিফিকেশন (সর্বোচ্চ ৬টি ঘর) */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-sm font-black text-white mb-3">🏷️ প্রোডাক্ট স্পেসিফিকেশন (সর্বোচ্চ ৬টি ঘর)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newProduct.specs.map((spec, idx) => (
                  <div key={idx} className="flex gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <input type="text" value={spec.label} onChange={(e) => handleSpecChange(idx, 'label', e.target.value)} placeholder={`Label ${idx + 1}`} className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                    <input type="text" value={spec.value} onChange={(e) => handleSpecChange(idx, 'value', e.target.value)} placeholder={`Value ${idx + 1}`} className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleUploadProduct} disabled={isUploading} className="mt-6 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl text-xs transition cursor-pointer shadow-lg">
              {isUploading ? 'প্রসেসিং হচ্ছে...' : '💾 প্রোডাক্ট ও স্পেসিফিকেশন সেভ করুন'}
            </button>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center py-20">
            <h2 className="text-2xl font-black text-white mb-2">ক্যাটাগরি ম্যানেজমেন্ট</h2>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">💰 Accounts & Finance</h3>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-black text-amber-400">🥀 Duo Corner Social Impact & Meal Fund</h3>
          </div>
        )}

      </main>
    </div>
  );
}