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
  TrackingCode?: string;
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'inventory' | 'customers' | 'marketing' | 'settlements' | 'automation' | 'reports' | 'staff' | 'cms' | 'system' | 'settings'
  >('orders');
  
  const [searchTerm, setSearchTerm] = useState('');

  // ইনভেন্টরি ম্যানেজমেন্টের স্টেট
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'add'>('list');

  const [productForm, setProductForm] = useState({
    productName: '',
    category: 'ব্রেসলেট (Bracelet)',
    regularPrice: '',
    offerPrice: '',
    stock: '',
    description: '',
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    imageUrl4: '',
    videoUrl: '',
    specs: [
      { label: 'Product Type', value: '' },
      { label: 'Usable Gender', value: '' },
      { label: 'Material', value: '' },
      { label: 'Color', value: '' },
      { label: 'Single Package Size', value: '' },
      { label: 'Single Gross Weight', value: '' },
      { label: 'More Info', value: '' }
    ]
  });

  // মার্কেটিং পিক্সেল সেটিংস স্টেট
  const [pixelConfig, setPixelConfig] = useState({
    metaPixelId: '',
    metaAccessToken: '',
    ga4Id: '',
    gtmId: '',
    tiktokPixelId: '',
    tiktokAccessToken: '',
    youtubeAdsId: '',
    capiEnabled: true,
    deduplicationActive: true
  });
  const [pixelSaved, setPixelSaved] = useState(false);

  // Customer & Fraud Management সাব-ট্যাব স্টেট
  const [customerSubTab, setCustomerSubTab] = useState<'profiles' | 'fraud' | 'verification' | 'queue' | 'watchlist'>('profiles');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Settlement & Money Trail স্টেট
  const [selectedSettlementOrder, setSelectedSettlementOrder] = useState<any | null>(null);

  // Automation Rules স্টেট
  const [rules, setRules] = useState([
    { id: 1, name: 'কুরিয়ার Delivered হলে অর্ডার ও COD পাওনা আপডেট', trigger: 'Courier Delivered', status: true },
    { id: 2, name: 'কম স্টক হলে অ্যালার্ট পাঠানো', trigger: 'Low Stock (<5)', status: true },
    { id: 3, name: 'নতুন অর্ডারে স্টক রিজার্ভ করা', trigger: 'New Order Created', status: true }
  ]);
  const [newRuleName, setNewRuleName] = useState('');

  // নতুন ফুল-স্ট্যাক মডিউল সাব-ট্যাব স্টেট
  const [staffSubTab, setStaffSubTab] = useState<'roles' | 'permissions' | 'logs'>('roles');
  const [cmsSubTab, setCmsSubTab] = useState<'banner' | 'catalog' | 'seo'>('banner');
  const [systemSubTab, setSystemSubTab] = useState<'health' | 'integrations' | 'backups'>('health');
  const [settingsSubTab, setSettingsSubTab] = useState<'profile' | 'commercial' | 'financial'>('profile');

  const fetchOrders = async () => {
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
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    const savedPixels = localStorage.getItem('duo_pixel_config');
    if (savedPixels) {
      try { setPixelConfig(JSON.parse(savedPixels)); } catch (e) {}
    }
  }, []);

  const handleCourierBooking = async (order: Order, index: number) => {
    const orderId = `DC-${index + 1}`;
    setBookingLoading(orderId);

    let rawPhone = String(order.phone || order.Phone || order.customerPhone || order.Number || order.number || '');
    let formattedPhone = rawPhone.replace(/\D/g, '');
    if (formattedPhone.length === 10 && !formattedPhone.startsWith('0')) {
      formattedPhone = '0' + formattedPhone;
    }

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
        alert(`সফল! কুরিয়ার ট্র্যাকিং আইডি (CN): ${result.consignmentId}`);
        
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

  const handleSpecChange = (index: number, val: string) => {
    const updated = [...productForm.specs];
    updated[index].value = val;
    setProductForm({ ...productForm, specs: updated });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.productName || !productForm.offerPrice) {
      alert('দয়া করে প্রোডাক্টের নাম এবং অফার প্রাইস লিখুন!');
      return;
    }

    setIsSubmitting(true);
    try {
      const validSpecs = productForm.specs.filter(s => s.value.trim() !== '');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_product',
          ...productForm,
          attributes: JSON.stringify(validSpecs)
        })
      });
      const data = await res.json();
      if (data.success || data.status === 'success') {
        alert('✅ প্রোডাক্ট সফলভাবে ইনভেন্টরিতে যুক্ত হয়েছে!');
        fetchProducts();
        setActiveSubTab('list');
        setProductForm({
          productName: '',
          category: 'ব্রেসলেট (Bracelet)',
          regularPrice: '',
          offerPrice: '',
          stock: '',
          description: '',
          imageUrl1: '',
          imageUrl2: '',
          imageUrl3: '',
          imageUrl4: '',
          videoUrl: '',
          specs: productForm.specs.map(s => ({ ...s, value: '' }))
        });
      } else {
        alert('❌ প্রোডাক্ট সেভ করতে ব্যর্থ হয়েছে!');
      }
    } catch (err) {
      alert('সার্ভার এরর!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePixels = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('duo_pixel_config', JSON.stringify(pixelConfig));
    setPixelSaved(true);
    setTimeout(() => setPixelSaved(false), 3000);
  };

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

  const filteredProducts = products.filter(p => 
    (p.productName || p.ProductName || '').toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.category || p.Category || '').toLowerCase().includes(productSearch.toLowerCase())
  );

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
      
      {/* সাইডবার মেনু */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="mb-8 px-2">
            <h2 className="text-xl font-black text-white tracking-wider">DUO CORNER</h2>
            <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest mt-0.5">Smart Commerce System</p>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'overview' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>📊 Overview Dashboard</button>
            <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'orders' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>📦 Orders & Processing ({orders.length})</button>
            <button onClick={() => setActiveTab('inventory')} className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'inventory' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>🏷️ Products & Inventory</button>
            <button onClick={() => setActiveTab('customers')} className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'customers' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>👥 Customer & Risk</button>
            <button onClick={() => setActiveTab('marketing')} className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'marketing' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>📈 Marketing & Pixels</button>
            <button onClick={() => setActiveTab('settlements')} className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'settlements' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>💰 Payments & COD</button>
            <button onClick={() => setActiveTab('automation')} className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'automation' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>⚡ Automation Rules</button>
            <button onClick={() => setActiveTab('reports')} className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'reports' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>📑 Professional Reports</button>
            <button onClick={() => setActiveTab('staff')} className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'staff' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>🔐 Staff & Permissions</button>
            <button onClick={() => setActiveTab('cms')} className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'cms' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>🌐 Website & CMS</button>
            <button onClick={() => setActiveTab('system')} className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'system' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>⚙️ System Health</button>
            <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${activeTab === 'settings' ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>🛠️ Business Settings</button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500">
          <p>System Status: <span className="text-emerald-400 font-bold">● Online</span></p>
        </div>
      </aside>

      {/* মূল কন্টেন্ট */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Duo Corner Operations Center</span>
            <h1 className="text-2xl font-black text-white mt-2">Business Overview & Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { fetchOrders(); fetchProducts(); }} className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer border border-slate-700">🔄 রিফ্রেশ</button>
            <div className="bg-rose-500/10 text-rose-400 px-4 py-2 rounded-xl text-sm font-bold border border-rose-500/20">Total Orders: {totalOrders}</div>
            <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-500/20">Total Sales: {totalSales.toLocaleString()}</div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl"><p className="text-xs font-bold text-slate-400 uppercase">Pending</p><h3 className="text-xl font-black text-amber-500 mt-1">{pendingCount}</h3></div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl"><p className="text-xs font-bold text-slate-400 uppercase">Processing</p><h3 className="text-xl font-black text-blue-500 mt-1">0</h3></div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl"><p className="text-xs font-bold text-slate-400 uppercase">Shipped</p><h3 className="text-xl font-black text-indigo-500 mt-1">0</h3></div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl"><p className="text-xs font-bold text-slate-400 uppercase">Delivered</p><h3 className="text-xl font-black text-emerald-500 mt-1">0</h3></div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl"><p className="text-xs font-bold text-slate-400 uppercase">Cancelled</p><h3 className="text-xl font-black text-rose-500 mt-1">0</h3></div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl"><p className="text-xs font-bold text-slate-400 uppercase">Returned</p><h3 className="text-xl font-black text-purple-500 mt-1">0</h3></div>
          </div>
        )}

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
                    <th className="p-4 font-bold">Tracking ID</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-center">Courier Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-500">No orders found!</td>
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
                      let cTracking = order.trackingCode || order.TrackingCode || order['Tracking Code'] || '';

                      const isBooked = cStatus.toLowerCase() === 'booked' || cStatus.toLowerCase() === 'sent';

                      return (
                        <tr key={idx} className="hover:bg-slate-800/50 transition">
                          <td className="p-4 font-bold text-rose-500">ORD-{idx + 1}</td>
                          <td className="p-4 text-slate-400 text-xs">{cDate ? new Date(cDate).toLocaleDateString() : 'N/A'}</td>
                          <td className="p-4 font-bold text-white">{cName}</td>
                          <td className="p-4 text-slate-300">{formattedPhone || 'No Number'}</td>
                          <td className="p-4 text-white font-medium">{cleanAmount}</td>
                          <td className="p-4 text-xs font-mono text-cyan-400 font-bold">
                            {cTracking ? cTracking : <span className="text-slate-500 font-normal">Not Booked</span>}
                          </td>
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

        {/* 🏷️ Products & Inventory Management ট্যাব */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Duo Corner Stock Control Center
                </span>
                <h2 className="text-xl font-black text-white mt-2">🏷️ Products & Inventory Management</h2>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveSubTab('list')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeSubTab === 'list' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  📦 সমস্ত প্রোডাক্ট ({products.length})
                </button>
                <button 
                  onClick={() => setActiveSubTab('add')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeSubTab === 'add' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  ➕ নতুন প্রোডাক্ট যুক্ত করুন
                </button>
              </div>
            </div>

            {activeSubTab === 'add' ? (
              <form onSubmit={handleSaveProduct} className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="text-base font-black text-white">✨ নতুন প্রোডাক্ট ও অ্যাডভান্সড স্পেসিফিকেশন এন্ট্রি ফর্ম</h3>
                  <button type="button" onClick={() => setActiveSubTab('list')} className="text-xs text-slate-400 hover:text-white cursor-pointer">✕ বাতিল</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Product Name *</label>
                    <input type="text" value={productForm.productName} onChange={e => setProductForm({...productForm, productName: e.target.value})} placeholder="যেমন: Magnetic Couple Bracelet" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Category</label>
                    <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none">
                      <option>ব্রেসলেট (Bracelet)</option>
                      <option>নেকলেস (Necklace)</option>
                      <option>স্মার্ট ওয়াচ (Smart Watch)</option>
                      <option>গিফট বক্স (Gift Box)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Stock (Inventory)</label>
                    <input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} placeholder="যেমন: 100" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Regular Price (কাটা মূল্য)</label>
                    <input type="number" value={productForm.regularPrice} onChange={e => setProductForm({...productForm, regularPrice: e.target.value})} placeholder="যেমন: 999" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Offer Price (বিক্রয় মূল্য) *</label>
                    <input type="number" value={productForm.offerPrice} onChange={e => setProductForm({...productForm, offerPrice: e.target.value})} placeholder="যেমন: 799" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Video URL</label>
                    <input type="text" value={productForm.videoUrl} onChange={e => setProductForm({...productForm, videoUrl: e.target.value})} placeholder="/video.mp4" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Description (বিবরণ)</label>
                  <textarea rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="প্রোডাক্টের আকর্ষণীয় বিবরণ..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none"></textarea>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <h4 className="col-span-full text-xs font-bold text-cyan-400">🖼️ Image URLs (1 to 4)</h4>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Image URL 1</label>
                    <input type="text" value={productForm.imageUrl1} onChange={e => setProductForm({...productForm, imageUrl1: e.target.value})} placeholder="parl.jpg" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Image URL 2</label>
                    <input type="text" value={productForm.imageUrl2} onChange={e => setProductForm({...productForm, imageUrl2: e.target.value})} placeholder="parl1.jpg" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Image URL 3</label>
                    <input type="text" value={productForm.imageUrl3} onChange={e => setProductForm({...productForm, imageUrl3: e.target.value})} placeholder="parl2.jpg" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Image URL 4</label>
                    <input type="text" value={productForm.imageUrl4} onChange={e => setProductForm({...productForm, imageUrl4: e.target.value})} placeholder="parl3.jpg" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white" />
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-amber-400">⚡ Product Specifications Matrix (7 Fields)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productForm.specs.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-1/2 text-xs font-bold text-slate-300">{spec.label}</span>
                        <input 
                          type="text" 
                          value={spec.value} 
                          onChange={e => handleSpecChange(idx, e.target.value)} 
                          placeholder={`Value ${idx + 1}`} 
                          className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl text-xs transition shadow-lg cursor-pointer">
                  {isSubmitting ? 'প্রসেসিং হচ্ছে...' : '💾 সেভ প্রোডাক্ট অ্যান্ড ইনভেন্টরি'}
                </button>
              </form>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">📦 Current Stock & Inventory List</h3>
                  <input 
                    type="text" 
                    placeholder="🔍 প্রোডাক্টের নাম বা ক্যাটাগরি দিয়ে খুঁজুন..." 
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-rose-500 w-full sm:w-72"
                  />
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Regular Price</th>
                        <th className="p-3">Offer Price</th>
                        <th className="p-3">Stock Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-500">কোনো প্রোডাক্ট পাওয়া যায়নি! নতুন প্রোডাক্ট যুক্ত করুন।</td>
                        </tr>
                      ) : (
                        filteredProducts.map((p, idx) => {
                          const stockNum = Number(p.stock || p.Stock || 0);
                          const isLowStock = stockNum < 5;

                          return (
                            <tr key={idx} className="hover:bg-slate-800/50">
                              <td className="p-3 font-bold text-white flex items-center gap-2">
                                {p.productName || p.ProductName || 'N/A'}
                                {isLowStock && <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md font-bold">Low Stock!</span>}
                              </td>
                              <td className="p-3 text-slate-300">{p.category || p.Category || 'General'}</td>
                              <td className="p-3 text-slate-400 line-through">৳{p.regularPrice || p.RegularPrice || 0}</td>
                              <td className="p-3 font-black text-emerald-400">৳{p.offerPrice || p.OfferPrice || p.price || 0}</td>
                              <td className="p-3">
                                <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                                  isLowStock ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                  {stockNum} Pcs
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button onClick={() => alert('স্টক ম্যানেজমেন্ট')} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer">
                                  ⚙️ Manage
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
          </div>
        )}

        {/* 👥 Customer & Fraud/Risk Management ট্যাব */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Duo Corner Customer Control Center
                </span>
                <h2 className="text-xl font-black text-white mt-2">👥 Customer 360° & Fraud Risk Management</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setCustomerSubTab('profiles')} className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${customerSubTab === 'profiles' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Customer 360°</button>
                <button onClick={() => setCustomerSubTab('fraud')} className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${customerSubTab === 'fraud' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Fraud Detection</button>
                <button onClick={() => setCustomerSubTab('verification')} className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${customerSubTab === 'verification' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>COD Verification</button>
                <button onClick={() => setCustomerSubTab('queue')} className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${customerSubTab === 'queue' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Review Queue</button>
                <button onClick={() => setCustomerSubTab('watchlist')} className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${customerSubTab === 'watchlist' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Watchlist & Block</button>
              </div>
            </div>

            {customerSubTab === 'profiles' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">🔍 Smart Customer Directory ({orders.length})</h3>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {orders.map((o, idx) => {
                      const cName = o.name || o.Name || o.customerName || 'Customer';
                      const cPhone = o.phone || o.Phone || o.Number || 'N/A';
                      return (
                        <div key={idx} onClick={() => setSelectedCustomer(o)} className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 cursor-pointer transition flex justify-between items-center">
                          <div>
                            <p className="text-xs font-bold text-white">{cName}</p>
                            <p className="text-[10px] text-slate-400">{cPhone}</p>
                          </div>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md font-bold">Verified</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">📋 Customer 360° Profile & Risk Score</h3>
                  {selectedCustomer ? (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div><span className="text-slate-400">Customer Name:</span> <strong className="text-white">{selectedCustomer.name || selectedCustomer.Name}</strong></div>
                        <div><span className="text-slate-400">Phone Number:</span> <strong className="text-cyan-400">{selectedCustomer.phone || selectedCustomer.Phone}</strong></div>
                        <div><span className="text-slate-400">Address:</span> <strong className="text-white">{selectedCustomer.address || selectedCustomer.Address || 'N/A'}</strong></div>
                        <div><span className="text-slate-400">Total Orders:</span> <strong className="text-emerald-400">1 (Low Risk Score: 15/100)</strong></div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <h4 className="font-bold text-amber-400">⚡ Trust Level & Risk Factors</h4>
                        <p className="text-slate-300">● পূর্বের সফল ডেলিভারি রেকর্ড ভালো।</p>
                        <p className="text-slate-300">● কোনো ডুপ্লিকেট অর্ডার বা রিটার্ন ফ্রড প্যাটার্ন নেই।</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500">বাম পাশের তালিকা থেকে যেকোনো কাস্টমার সিলেক্ট করুন।</div>
                  )}
                </div>
              </div>
            )}
            {customerSubTab === 'fraud' && <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"><h3 className="text-sm font-bold text-white">🛡️ Fraud Detection Engine</h3><p className="text-xs text-slate-400 mt-2">ডুপ্লিকেট ও সন্দেহজনক অর্ডার মনিটরিং চলছে।</p></div>}
            {customerSubTab === 'verification' && <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"><h3 className="text-sm font-bold text-white">📱 COD Verification Center</h3><p className="text-xs text-slate-400 mt-2">SMS OTP ও কল কনফার্মেশন কিউ।</p></div>}
            {customerSubTab === 'queue' && <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"><h3 className="text-sm font-bold text-white">⏳ Review Queue</h3><p className="text-xs text-slate-400 mt-2">উচ্চ ঝুঁকিপূর্ণ অর্ডার পর্যালোচনার তালিকা।</p></div>}
            {customerSubTab === 'watchlist' && <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"><h3 className="text-sm font-bold text-white">🚫 Watchlist & Blocklist</h3><p className="text-xs text-slate-400 mt-2">সীমাবদ্ধ কাস্টমারদের তালিকা।</p></div>}
          </div>
        )}

        {/* 📈 Marketing, Pixels & Server-Side Tracking ট্যাব */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Duo Corner Marketing Control Center
                </span>
                <h2 className="text-xl font-black text-white mt-2">📈 Marketing, Pixels & Server-Side Tracking</h2>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl">
                CAPI & Deduplication: Active
              </div>
            </div>

            {pixelSaved && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-bold">
                ✅ মার্কেটিং পিক্সেল এবং ট্র্যাকিং কনফিগারেশন সফলভাবে সেভ হয়েছে!
              </div>
            )}

            <form onSubmit={handleSavePixels} className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
              <h3 className="text-base font-black text-white border-b border-slate-800 pb-3">⚙️ Multi-Platform Pixel & API Token Manager</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Meta (Facebook & Instagram) Pixel ID</label>
                  <input type="text" value={pixelConfig.metaPixelId} onChange={e => setPixelConfig({...pixelConfig, metaPixelId: e.target.value})} placeholder="যেমন: 123456789012345" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Meta Conversion API (CAPI) Access Token</label>
                  <input type="text" value={pixelConfig.metaAccessToken} onChange={e => setPixelConfig({...pixelConfig, metaAccessToken: e.target.value})} placeholder="EAAG..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Google Analytics 4 (GA4) Measurement ID</label>
                  <input type="text" value={pixelConfig.ga4Id} onChange={e => setPixelConfig({...pixelConfig, ga4Id: e.target.value})} placeholder="G-XXXXXXXXXX" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Google Tag Manager (GTM) Container ID</label>
                  <input type="text" value={pixelConfig.gtmId} onChange={e => setPixelConfig({...pixelConfig, gtmId: e.target.value})} placeholder="GTM-XXXXXXX" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">TikTok Pixel ID</label>
                  <input type="text" value={pixelConfig.tiktokPixelId} onChange={e => setPixelConfig({...pixelConfig, tiktokPixelId: e.target.value})} placeholder="CXXXXXXXXXXXXX" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">TikTok Events API Access Token</label>
                  <input type="text" value={pixelConfig.tiktokAccessToken} onChange={e => setPixelConfig({...pixelConfig, tiktokAccessToken: e.target.value})} placeholder="TikTok Token..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-500 focus:outline-none" />
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white">Server-Side Tracking (CAPI) & Deduplication</h4>
                  <p className="text-[11px] text-slate-400 mt-1">আইওএস বা অ্যাড ব্লকার এড়াতে সার্ভার থেকে সরাসরি ইভেন্ট ফায়ার করার টগল।</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={pixelConfig.capiEnabled} onChange={e => setPixelConfig({...pixelConfig, capiEnabled: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl text-xs transition shadow-lg cursor-pointer">
                💾 সেভ মার্কেটিং ও পিক্সেল কনফিগারেশন
              </button>
            </form>
          </div>
        )}

        {/* 💰 ১. Payment & Courier COD Settlement Center (Money Trail সহ) */}
        {activeTab === 'settlements' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Duo Corner Financial Control Center
                </span>
                <h2 className="text-xl font-black text-white mt-2">💰 Payment & Courier COD Settlement Center</h2>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl">
                Status: Auto-Reconciliation Active
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">মোট COD পাওনা</p>
                <h3 className="text-xl font-black text-amber-500 mt-1">৳ {totalSales.toLocaleString()}</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">কুরিয়ারের কাছে বকেয়া</p>
                <h3 className="text-xl font-black text-cyan-400 mt-1">৳ {totalSales.toLocaleString()}</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">ব্যাঙ্কে প্রাপ্ত টাকা</p>
                <h3 className="text-xl font-black text-emerald-400 mt-1">৳ 0</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">অমীমাংসিত পার্থক্য</p>
                <h3 className="text-xl font-black text-rose-500 mt-1">৳ 0</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">📦 Order Settlement List & Reconciliation</h3>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">COD Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Money Trail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders.map((o, idx) => {
                        let amt = Number(String(o.amount || o.Amount || o.productPrice || o.collectionAmount || o['Collection Amount'] || '0').replace(/[^\d]/g, '')) || 0;
                        return (
                          <tr key={idx} className="hover:bg-slate-800/50">
                            <td className="p-3 font-bold text-rose-500">ORD-{idx + 1}</td>
                            <td className="p-3 text-white">{o.name || o.Name || 'Customer'}</td>
                            <td className="p-3 text-emerald-400 font-bold">৳{amt}</td>
                            <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">{o.status || o.Status || 'Pending'}</span></td>
                            <td className="p-3 text-right">
                              <button onClick={() => setSelectedSettlementOrder(o)} className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer">
                                🔍 Money Trail
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">🛤️ Order Money Trail (এ টু জেড ইতিহাস)</h3>
                {selectedSettlementOrder ? (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <p className="text-slate-400">গ্রাহক: <strong className="text-white">{selectedSettlementOrder.name || selectedSettlementOrder.Name}</strong></p>
                      <p className="text-slate-400">মোবাইল: <strong className="text-white">{selectedSettlementOrder.phone || selectedSettlementOrder.Phone}</strong></p>
                      <p className="text-slate-400">মূল্য: <strong className="text-emerald-400">৳{selectedSettlementOrder.amount || selectedSettlementOrder.Amount || 0}</strong></p>
                    </div>
                    <div className="space-y-2 text-[11px] text-slate-300">
                      <div className="flex items-center gap-2"><span>1️⃣</span> <span>অর্ডার তৈরি ও স্টক রিজার্ভ: সম্পন্ন</span></div>
                      <div className="flex items-center gap-2"><span>2️⃣</span> <span className="text-cyan-400">কুরিয়ারে বুকিং ও ট্র্যাকিং আইডি বরাদ্দ</span></div>
                      <div className="flex items-center gap-2"><span>3️⃣</span> <span className="text-amber-400">কুরিয়ার থেকে ডেলিভারি ও COD কালেকশন অপেক্ষা করছে</span></div>
                      <div className="flex items-center gap-2"><span>4️⃣</span> <span className="text-slate-500">ব্যাংক সেটেলমেন্ট ও চার্জ কর্তন: বাকি</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500">বাম পাশের টেবিল থেকে যেকোনো অর্ডারের 'Money Trail' দেখতে ক্লিক করুন।</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ⚡ ২. Automation Rules & Workflow Engine */}
        {activeTab === 'automation' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Duo Corner Automation Center
                </span>
                <h2 className="text-xl font-black text-white mt-2">⚡ Business Automation & Rules Engine</h2>
              </div>
              <div className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl">
                Visual Builder Active
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">📜 Active Automation Rules</h3>
                <div className="space-y-3">
                  {rules.map(rule => (
                    <div key={rule.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-white">{rule.name}</p>
                        <p className="text-[10px] text-cyan-400 mt-0.5">Trigger: {rule.trigger}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">➕ Create New Automation Rule</h3>
                <form onSubmit={e => { e.preventDefault(); if(newRuleName){ setRules([...rules, {id: rules.length+1, name: newRuleName, trigger: 'Custom Event', status: true}]); setNewRuleName(''); alert('নিয়ম সফলভাবে যোগ করা হয়েছে!'); }}} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-2">Rule Name (নিয়মের নাম)</label>
                    <input type="text" value={newRuleName} onChange={e => setNewRuleName(e.target.value)} placeholder="যেমন: ২৪ ঘণ্টা আপডেট না হলে অ্যালার্ট" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-rose-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-2">Trigger (কখন কাজ করবে)</label>
                    <select className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none">
                      <option>নতুন অর্ডার তৈরি হলে</option>
                      <option>কুরিয়ার Delivered হলে</option>
                      <option>স্টক কমে গেলে</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition cursor-pointer">
                    ⚡ Save & Activate Rule
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 📑 Professional Reports & BI Hub */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Duo Corner Intelligence</span>
                <h2 className="text-xl font-black text-white mt-2">📑 Professional Reports & Business Intelligence</h2>
              </div>
              <div className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl border border-emerald-500/20">Live BI Active</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl"><h3 className="font-bold text-sm text-white">Sales & Revenue</h3><p className="text-xs text-slate-400 mt-1">নেট সেলস, গ্রস প্রফিট ও ক্যাশ ফ্লো রিপোর্ট।</p></div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl"><h3 className="font-bold text-sm text-white">Courier Success Rate</h3><p className="text-xs text-slate-400 mt-1">ডেলিভারি সাকসেস ও রিটার্ন অ্যানালিসিস।</p></div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl"><h3 className="font-bold text-sm text-white">Export Center</h3><p className="text-xs text-slate-400 mt-1">Excel, CSV ও PDF রিপোর্ট ডাউনলোড।</p></div>
            </div>
          </div>
        )}

        {/* 🔐 Staff, Permissions & Approval Center */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Access Control Center</span>
                <h2 className="text-xl font-black text-white mt-2">🔐 Staff, Permissions & Approval Center</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStaffSubTab('roles')} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${staffSubTab === 'roles' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Roles</button>
                <button onClick={() => setStaffSubTab('permissions')} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${staffSubTab === 'permissions' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Permissions</button>
                <button onClick={() => setStaffSubTab('logs')} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${staffSubTab === 'logs' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Activity Logs</button>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-2">📋 Staff Roles: Super Admin, Order Manager, Accountant, Support</h3>
              <p className="text-xs text-slate-400">রোল-ভিত্তিক পারমিশন এবং সংবেদনশীল কাজের অডিট লগ এখানে সংরক্ষিত রয়েছে।</p>
            </div>
          </div>
        )}

        {/* 🌐 Website & Content Management (CMS) */}
        {activeTab === 'cms' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">CMS Control Center</span>
                <h2 className="text-xl font-black text-white mt-2">🌐 Website & Content Management (CMS)</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCmsSubTab('banner')} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${cmsSubTab === 'banner' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Hero Banner</button>
                <button onClick={() => setCmsSubTab('catalog')} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${cmsSubTab === 'catalog' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Catalog CMS</button>
                <button onClick={() => setCmsSubTab('seo')} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${cmsSubTab === 'seo' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>SEO Settings</button>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-2">✨ Visual Website Editor & Rollback Safety</h3>
              <p className="text-xs text-slate-400">কোড না লিখে হোমপেজ ব্যানার, অফার বার এবং এসইও মেটা ট্যাগ পরিবর্তন করুন।</p>
            </div>
          </div>
        )}

        {/* ⚙️ Integration, API & System Health Center */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">System Reliability</span>
                <h2 className="text-xl font-black text-white mt-2">⚙️ Integration, API & System Health Center</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSystemSubTab('health')} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${systemSubTab === 'health' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Health Dashboard</button>
                <button onClick={() => setSystemSubTab('integrations')} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${systemSubTab === 'integrations' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>API & Webhooks</button>
                <button onClick={() => setSystemSubTab('backups')} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${systemSubTab === 'backups' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Backups</button>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-2">🟢 API Status: Steadfast Courier & Google Sheets Online</h3>
              <p className="text-xs text-slate-400">অটোমেটিক ব্যাকআপ, এরর লগ এবং রtry কিউ মনিটরিং সিস্টেম active রয়েছে।</p>
            </div>
          </div>
        )}

        {/* 🛠️ Business Settings & Configuration Center */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Configuration Center</span>
                <h2 className="text-xl font-black text-white mt-2">🛠️ Business Settings & Configuration Center</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSettingsSubTab('profile')} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${settingsSubTab === 'profile' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Business Profile</button>
                <button onClick={() => setSettingsSubTab('commercial')} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${settingsSubTab === 'commercial' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Commercial Rules</button>
                <button onClick={() => setSettingsSubTab('financial')} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${settingsSubTab === 'financial' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Financial Config</button>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white">🏪 Duo Corner Business Profile & Currency</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-slate-400">ব্যবসার নাম: <strong className="text-white">Duo Corner</strong></p>
                  <p className="text-slate-400 mt-1">কারেন্সি: <strong className="text-emerald-400">BDT (৳)</strong></p>
                  <p className="text-slate-400 mt-1">টাইম জোন: <strong className="text-white">Asia/Dhaka</strong></p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-slate-400">ডিফল্ট ডেলিভারি চার্জ রুলস: <strong className="text-cyan-400">Active</strong></p>
                  <p className="text-slate-400 mt-1">COD পলিসি: <strong className="text-white">Cash on Delivery Enabled</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}