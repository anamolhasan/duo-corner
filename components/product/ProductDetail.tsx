'use client';
import { useState } from 'react';
import type { Product } from '@/lib/data';
import { divisionData, merchantSpecialNote } from '@/lib/data';

type ProductDetailProps = {
  product: Product;
  onBack: () => void;
};

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  const p = product as any;
  
  const productName = p.name || p.productName || "Product";
  const productPrice = Number(p.basePrice || p.price || 799);
  const productCategory = p.category || "Couple Item";
  const productDescription = p.description || "এক্সক্লুসিভ কাপল প্রোডাক্ট এবং আকর্ষণীয় গিফট বক্স।";
  const productAttributes = p.attributes || [{ label: "Product Type", value: "Gift Box" }];

  let imageList: string[] = Array.isArray(p.images) && p.images.length > 0 ? p.images : ["/parl.jpg"];
  const productVideo = p.videoUrl || "/video.mp4";

  const [selectedImage, setSelectedImage] = useState(imageList[0] || "/parl.jpg");
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // বিভাগ, জেলা এবং থানার ডাইনামিক স্টেট
  const divisions = Object.keys(divisionData);
  const [selectedDivision, setSelectedDivision] = useState(divisions[0] || 'Dhaka');

  const districts = Object.keys(divisionData[selectedDivision] || {});
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0] || '');

  const thanas = divisionData[selectedDivision]?.[selectedDistrict] || [];
  const [selectedThana, setSelectedThana] = useState(thanas[0] || '');

  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [specialNote, setSpecialNote] = useState('');
  const [agreed, setAgreed] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // বিভাগ পরিবর্তনের হ্যান্ডলার
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const div = e.target.value;
    setSelectedDivision(div);
    const newDistricts = Object.keys(divisionData[div] || {});
    const firstDist = newDistricts[0] || '';
    setSelectedDistrict(firstDist);
    const newThanas = divisionData[div]?.[firstDist] || [];
    setSelectedThana(newThanas[0] || '');
  };

  // জেলা পরিবর্তনের হ্যান্ডলার
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dist = e.target.value;
    setSelectedDistrict(dist);
    const newThanas = divisionData[selectedDivision]?.[dist] || [];
    setSelectedThana(newThanas[0] || '');
  };

  const deliveryCharge = selectedDivision === 'Dhaka' ? 70 : 130; 
  const subtotal = productPrice * quantity;
  const total = subtotal + deliveryCharge;

  const scrollToCheckout = () => {
    document.getElementById('one-page-checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert("দয়া করে নাম, ফোন নম্বর এবং ঠিকানা পূরণ করুন!");
      return;
    }
    if (phone.length !== 11 || !phone.startsWith('01')) {
      alert("দয়া করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন!");
      return;
    }
    if (!agreed) {
      alert("দয়া করে শর্তাবলীতে সম্মতি দিন!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          phone: phone,
          division: selectedDivision,
          district: selectedDistrict,
          thana: selectedThana,
          address: address,
          productName,
          quantity,
          deliveryCharge,
          totalPrice: total,
          paymentMethod,
          note: specialNote
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrderSuccess(true);
      } else {
        alert("অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch {
      alert("সার্ভার এরর!");
    }
    setLoading(false);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-rose-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            🎉
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            খুব শীঘ্রই আমাদের প্রতিনিধি আপনার নাম্বারে যোগাযোগ করবেন।
          </p>
          <button 
            onClick={onBack}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer"
          >
            হোমপেজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 font-sans text-gray-900">
      <button 
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-xl shadow-sm border border-gray-200 text-xs transition cursor-pointer"
      >
        <span>←</span> হোমপেজে ফিরে যান
      </button>

      {/* Product Image Gallery */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6">
        <div className="w-full h-72 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-3">
          <img src={selectedImage} alt={productName} className="w-full h-full object-cover" />
        </div>

        {imageList.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {imageList.map((img: string, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition cursor-pointer ${selectedImage === img ? 'border-rose-600 scale-105 shadow-md' : 'border-gray-200 opacity-70'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-4">
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
            {productCategory}
          </span>
          <h1 className="text-lg font-bold text-gray-900 mt-2">{productName}</h1>
          <p className="text-xl font-black text-rose-600 mt-1">৳{productPrice}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button 
            onClick={scrollToCheckout}
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl shadow-sm text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            🛒 Add to Cart
          </button>
          <button 
            onClick={scrollToCheckout}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            ⚡ Order Now
          </button>
        </div>
      </div>

      {/* Checkout Form */}
      <div id="one-page-checkout" className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-200 scroll-mt-6">
        <form onSubmit={handleOrderSubmit} className="space-y-6">

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-rose-600 rounded-full"></span> Order Review
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={selectedImage} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                <div>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{productName}</h4>
                  <p className="text-xs font-black text-gray-900 mt-0.5">৳{subtotal}</p>
                </div>
              </div>

              <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2.5 py-1 font-bold text-xs">-</button>
                <span className="px-3 py-1 text-xs font-bold text-gray-900">{quantity}</span>
                <button type="button" onClick={() => setQuantity(q => q + 1)} className="px-2.5 py-1 font-bold text-xs">+</button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-rose-600 rounded-full"></span> Shipping Address
            </h3>
            
            <div className="space-y-3">
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="আপনার নাম (Full Name) *" 
                required
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500" 
              />

              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                <div className="bg-gray-100 px-3 py-2.5 text-xs font-bold text-gray-600 border-r border-gray-300">88</div>
                <input 
                  type="text" 
                  maxLength={11}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="017******** (১১ ডিজিট) *" 
                  required
                  className="w-full px-3.5 py-2.5 text-xs focus:outline-none" 
                />
              </div>

              {/* বিভাগ ও জেলা ড্রপডাউন */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">বিভাগ (Division)</label>
                  <select 
                    value={selectedDivision}
                    onChange={handleDivisionChange}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">জেলা (District)</label>
                  <select 
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    {districts.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                  </select>
                </div>
              </div>

              {/* থানা ড্রপডাউন */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1">থানা / উপজেলা (Thana)</label>
                <select 
                  value={selectedThana}
                  onChange={(e) => setSelectedThana(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  {thanas.map(thana => <option key={thana} value={thana}>{thana}</option>)}
                </select>
              </div>

              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="বিস্তারিত ঠিকানা (বাসা নং, রোড, এলাকা) *" 
                required
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500" 
              />
            </div>
          </div>

          <div className="space-y-2 border-t border-b border-gray-200 py-3 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Sub total</span>
              <span className="font-bold text-gray-900">৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery cost</span>
              <span className="font-bold text-gray-900">৳{deliveryCharge}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-900 pt-1">
              <span>Total</span>
              <span className="text-rose-600">৳{total}</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-gray-800 space-y-2 leading-relaxed shadow-sm">
            <p>{merchantSpecialNote}</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-xl shadow-lg shadow-rose-600/30 transition cursor-pointer text-sm"
          >
            {loading ? 'প্রসেসিং হচ্ছে...' : `✅ অর্ডার কনফার্ম করুন (৳${total})`}
          </button>
        </form>
      </div>
    </div>
  );
}