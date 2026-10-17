'use client';
import { useState, useEffect } from 'react';

export default function InventoryManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // নতুন প্রোডাক্ট ফর্ম স্টেট (আপনার দেওয়া সুনির্দিষ্ট ফিল্ড অনুযায়ী)
  const [productForm, setProductForm] = useState({
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
      { label: 'Value 1', value: '' },
      { label: 'Usable Gender', value: '' },
      { label: 'Value 2', value: '' },
      { label: 'Material', value: '' },
      { label: 'Value 3', value: '' },
      { label: 'Color', value: '' },
      { label: 'Value 4', value: '' },
      { label: 'Single Package Size', value: '' },
      { label: 'Value 5', value: '' },
      { label: 'Single Gross Weight', value: '' },
      { label: 'Value 6', value: '' },
      { label: 'More Specs', value: '' },
      { label: 'Value 7', value: '' }
    ]
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ প্রোডাক্ট সফলভাবে ইনভেন্টরিতে যুক্ত হয়েছে!');
        fetchProducts();
        // ফর্ম রিসেট
        setProductForm({
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

  return (
    <div className="space-y-8 font-sans">
      {/* টপ হেডার */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white">🏷️ Products & Inventory Management</h2>
          <p className="text-xs text-slate-400 mt-1">স্টক কন্ট্রোল, মাল্টি-ইমেজ ও অ্যাডভান্সড স্পেসিফিকেশন ম্যানেজার</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl">
          Total Inventory: {products.length} Items
        </div>
      </div>

      {/* নতুন প্রোডাক্ট এন্ট্রি ও আপলোড ফর্ম */}
      <form onSubmit={handleSaveProduct} className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
        <h3 className="text-base font-black text-white border-b border-slate-800 pb-3">➕ নতুন প্রোডাক্ট ও স্পেসিফিকেশন যুক্ত করুন</h3>
        
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

        {/* মাল্টি-ইমেজ ইউআরএল ঘর */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
          <h4 className="col-span-full text-xs font-bold text-cyan-400">🖼️ Image URLs (1 to 4)</h4>
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Image URL 1</label>
            <input type="text" value={productForm.imageUrl1} onChange={e => setProductForm({...productForm, imageUrl1: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Image URL 2</label>
            <input type="text" value={productForm.imageUrl2} onChange={e => setProductForm({...productForm, imageUrl2: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Image URL 3</label>
            <input type="text" value={productForm.imageUrl3} onChange={e => setProductForm({...productForm, imageUrl3: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Image URL 4</label>
            <input type="text" value={productForm.imageUrl4} onChange={e => setProductForm({...productForm, imageUrl4: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white" />
          </div>
        </div>

        {/* প্রোডাক্ট স্পেসিফিকেশন ম্যাট্রিক্স */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-amber-400">⚡ Product Specifications & Matrix</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productForm.specs.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="w-1/2 text-xs font-bold text-slate-300">{spec.label}</span>
                <input 
                  type="text" 
                  value={spec.value} 
                  onChange={e => handleSpecChange(idx, e.target.value)} 
                  placeholder={`Enter ${spec.label}`} 
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

      {/* বর্তমান ইনভেন্টরি তালিকা টেবিল */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">📦 Current Stock & Product List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Regular Price</th>
                <th className="p-3">Offer Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-500">কোনো প্রোডাক্ট পাওয়া যায়নি!</td>
                </tr>
              ) : (
                products.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white">{p.productName || p.ProductName || 'N/A'}</td>
                    <td className="p-3 text-slate-300">{p.category || p.Category || 'General'}</td>
                    <td className="p-3 text-slate-400 line-through">৳{p.regularPrice || p.RegularPrice || 0}</td>
                    <td className="p-3 font-black text-emerald-400">৳{p.offerPrice || p.OfferPrice || p.price || 0}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        Number(p.stock || p.Stock || 0) < 5 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {p.stock || p.Stock || 0} Pcs
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => alert('এডিট বা স্টক আপডেট অপশন')} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                        ⚙️ Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}