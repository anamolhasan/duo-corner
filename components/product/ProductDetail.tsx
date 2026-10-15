'use client';
import { useState } from 'react';
import type { Product } from '@/lib/data';
import { divisionData } from '@/lib/data';

type ProductDetailProps = {
  product: Product;
  onBack: () => void;
};

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  const p = product as any;
  
  const productName = p.name || p.productName || p['Product Name'] || "Product";
  
  // গুগল শিট থেকে আসা সঠিক অফার প্রাইস এবং রেগুলার প্রাইস ডাইনামিকলি রিড করা
  const regularPrice = Number(p.regularPrice || p['Regular Price'] || p.RegularPrice || 999);
  const offerPrice = Number(p.basePrice || p.price || p['Offer Price'] || p.OfferPrice || 799);
  
  const discountPercent = regularPrice > offerPrice ? Math.round(((regularPrice - offerPrice) / regularPrice) * 100) : 0;

  const productCategory = p.category || p['Category'] || "Couple Item";
  const productDescription = p.description || p['Description'] || "এক্সক্লুসিভ কাপল প্রোডাক্ট এবং আকর্ষণীয় গিফট বক্স।";
  
  // গুগল শিট বা প্রোডাক্ট অবজেক্ট থেকে ডাইনামিক স্পেসিফিকেশন বা অ্যাট্রিবিউট সংগ্রহ
  let productAttributes = p.attributes || [];
  if (typeof productAttributes === 'string') {
    try {
      productAttributes = JSON.parse(productAttributes);
    } catch {
      productAttributes = [];
    }
  }

  // যদি শিটে আলাদা অ্যাট্রিবিউট না থাকে, তবে ডিফল্ট ক্যাটাগরি ও স্টক দেখাবে
  if (!Array.isArray(productAttributes) || productAttributes.length === 0) {
    productAttributes = [
      { label: "Category", value: productCategory },
      { label: "Stock", value: String(p.stock || p['Stock'] || "Available") }
    ];
  }

  // গুগল শিটের Image URL1 থেকে Image URL4 কলামগুলো থেকে ১০০% নিখুঁতভাবে ছবি সংগ্রহ
  let imageList: string[] = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    imageList = p.images;
  } else {
    const columnSources = [
      p['Image URL1'] || p.imageUrl1,
      p['Image URL2'] || p.imageUrl2,
      p['Image URL3'] || p.imageUrl3,
      p['Image URL4'] || p.imageUrl4,
    ];

    columnSources.forEach(img => {
      if (img && typeof img === 'string' && img.trim() !== '') {
        let clean = img.trim();
        let formatted = /^https?:\/\//i.test(clean) ? clean : '/' + clean.replace(/^\/+/, '');
        if (!imageList.includes(formatted)) {
          imageList.push(formatted);
        }
      }
    });
  }

  if (imageList.length === 0) {
    imageList = ["/parl.jpg"];
  }

  // গুগল শিট থেকে নির্দিষ্ট প্রোডাক্টের ভিডিও ইউআরএল ডাইনামিকলি নেওয়া
  let productVideo = p.videoUrl || p['Video URL'] || p.video || "/video.mp4";
  if (productVideo && !productVideo.startsWith('http') && !productVideo.startsWith('/')) {
    productVideo = '/' + productVideo;
  }

  const [selectedImage, setSelectedImage] = useState(imageList[0] || "/parl.jpg");
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const divisions = Object.keys(divisionData);
  const [selectedDivision, setSelectedDivision] = useState(divisions[0] || 'ঢাকা');

  const districts = Object.keys(divisionData[selectedDivision] || {});
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0] || '');

  const thanas = divisionData[selectedDivision]?.[selectedDistrict] || [];
  const [selectedThana, setSelectedThana] = useState(thanas[0] || '');

  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [coupon, setCoupon] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [agreed, setAgreed] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const div = e.target.value;
    setSelectedDivision(div);
    const newDistricts = Object.keys(divisionData[div] || {});
    const firstDist = newDistricts[0] || '';
    setSelectedDistrict(firstDist);
    const newThanas = divisionData[div]?.[firstDist] || [];
    setSelectedThana(newThanas[0] || '');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dist = e.target.value;
    setSelectedDistrict(dist);
    const newThanas = divisionData[selectedDivision]?.[dist] || [];
    setSelectedThana(newThanas[0] || '');
  };

  const deliveryCharge = selectedDivision === 'ঢাকা' ? 70 : 130; 
  const subtotal = offerPrice * quantity;
  const total = subtotal + deliveryCharge;

  const scrollToCheckout = () => {
    const formElement = document.getElementById('one-page-checkout');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert("দয়া করে নাম, ফোন নম্বর এবং ঠিকানা পূরণ করুন!");
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
          note: `${productName} (Qty: ${quantity}), Note: ${specialNote}, Payment: ${paymentMethod}, Delivery: ${deliveryCharge} BDT`,
          amount: total
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
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            🎉
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            আপনার অর্ডারটি কনফার্ম করতে খুব শীঘ্রই আমাদের প্রতিনিধি আপনার নাম্বারে যোগাযোগ করবেন।
          </p>
          <button 
            onClick={onBack}
            className="w-full bg-[#f8931f] hover:bg-[#e08219] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer"
          >
            আরও কেনাকাটা করুন
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

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
        
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl mb-4 flex items-center justify-between shadow-sm">
          <span>🔥 সীমিত সময়ের মেগা অফার! ফ্রি গিফট বক্স ও ক্যাশ অন ডেলিভারি</span>
          {discountPercent > 0 && (
            <span className="bg-white text-rose-600 px-2 py-0.5 rounded-lg text-[11px] font-black">
              SAVE {discountPercent}%
            </span>
          )}
        </div>

        <div className="w-full h-72 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-3 relative">
          <img 
            src={selectedImage} 
            alt={productName} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/parl.jpg";
            }}
          />
        </div>

        {imageList.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {imageList.map((img: string, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition cursor-pointer ${selectedImage === img ? 'border-[#f8931f] scale-105 shadow-md' : 'border-gray-200 opacity-70'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-4">
          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
            {productCategory}
          </span>
          <h1 className="text-lg font-bold text-gray-900 mt-2">
            {productName}
          </h1>
          
          <div className="flex items-center gap-3 mt-2">
            <span className="text-2xl font-black text-orange-600">৳{offerPrice}</span>
            {regularPrice > offerPrice && (
              <span className="text-sm font-bold text-gray-400 line-through">৳{regularPrice}</span>
            )}
            {discountPercent > 0 && (
              <span className="bg-rose-100 text-rose-600 text-xs font-black px-2 py-0.5 rounded-full">
                {discountPercent}% OFF
              </span>
            )}
          </div>
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
            className="bg-[#f8931f] hover:bg-[#e08219] text-white font-bold py-3 px-4 rounded-xl shadow-sm text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            ⚡ Order Now
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-orange-500">⚡</span> PRODUCT SPECIFICATIONS
          </h3>
          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">100% ORIGINAL</span>
        </div>

        <div className="divide-y divide-gray-50 text-xs">
          {productAttributes.map((attr: { label: string; value: string }, idx: number) => (
            <div key={idx} className="py-2.5 grid grid-cols-3 gap-4 items-center">
              <span className="font-medium text-gray-500">{attr.label}</span>
              <span className="col-span-2 font-semibold text-gray-800">{attr.value}</span>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <h4 className="text-xs font-bold text-gray-800 mb-1">{productName}</h4>
          <p className="text-[11px] text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
            {productDescription}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#f8931f] rounded-full"></span> Product Video Review (ভিডিও রিভিউ)
          </h3>
          <div className="rounded-xl overflow-hidden bg-black border border-gray-200 aspect-video flex items-center justify-center">
            <video src={productVideo} controls autoPlay muted loop className="w-full h-full object-cover" key={productVideo}>
              আপনার ব্রাউজার ভিডিও ট্যাগ সাপোর্ট করে না।
            </video>
          </div>
        </div>
      </div>

      <div id="one-page-checkout" className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-200 scroll-mt-6">
        <form onSubmit={handleOrderSubmit} className="space-y-6">

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#f8931f] rounded-full"></span> Order review
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={selectedImage} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                <div>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{productName}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-black text-orange-600">৳{offerPrice * quantity}</span>
                    {regularPrice > offerPrice && (
                      <span className="text-[10px] text-gray-400 line-through">৳{regularPrice * quantity}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold text-xs">-</button>
                <span className="px-3 py-1 text-xs font-bold text-gray-900">{quantity}</span>
                <button type="button" onClick={() => setQuantity(q => q + 1)} className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold text-xs">+</button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#f8931f] rounded-full"></span> Shipping Address
            </h3>
            
            <div className="space-y-3">
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Full Name *" 
                required
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#f8931f]" 
              />

              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                <div className="bg-gray-100 px-3 py-2.5 text-xs font-bold text-gray-600 border-r border-gray-300">88</div>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017********" 
                  required
                  className="w-full px-3.5 py-2.5 text-xs focus:outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">বিভাগ (Division)</label>
                  <select 
                    value={selectedDivision}
                    onChange={handleDivisionChange}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#f8931f] cursor-pointer"
                  >
                    {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">জেলা (District)</label>
                  <select 
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#f8931f] cursor-pointer"
                  >
                    {districts.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">থানা / উপজেলা (Thana)</label>
                <select 
                  value={selectedThana}
                  onChange={(e) => setSelectedThana(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#f8931f] cursor-pointer"
                >
                  {thanas.map(thana => <option key={thana} value={thana}>{thana}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="ex: House no. / building / street / area" 
            required
            className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#f8931f]" 
          />

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#f8931f] rounded-full"></span> Payment method
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div 
                onClick={() => setPaymentMethod('cod')}
                className={`border rounded-xl p-3 flex items-center justify-between cursor-pointer transition ${paymentMethod === 'cod' ? 'border-[#f8931f] bg-orange-50/30 ring-1 ring-[#f8931f]' : 'border-gray-200 bg-white'}`}
              >
                <span className="text-xs font-bold text-gray-800">💵 Cash On Delivery</span>
                <input type="radio" checked={paymentMethod === 'cod'} readOnly className="accent-[#f8931f]" />
              </div>

              <div 
                onClick={() => setPaymentMethod('online')}
                className={`border rounded-xl p-3 flex items-center justify-between cursor-pointer transition ${paymentMethod === 'online' ? 'border-[#f8931f] bg-orange-50/30 ring-1 ring-[#f8931f]' : 'border-gray-200 bg-white'}`}
              >
                <span className="text-xs font-bold text-gray-800">💳 Online Payment</span>
                <input type="radio" checked={paymentMethod === 'online'} readOnly className="accent-[#f8931f]" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <span className="text-xs font-bold text-gray-700 block mb-2">Have any coupon or gift voucher?</span>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter Coupon" 
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none"
              />
              <button type="button" className="bg-[#f8931f] text-white px-4 py-2 rounded-lg text-xs font-bold">Apply coupon</button>
            </div>
          </div>

          <div className="space-y-2 border-t border-b border-gray-200 py-3 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Sub total</span>
              <span className="font-bold text-gray-900">{subtotal}.00 BDT</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery cost</span>
              <span className="font-bold text-gray-900">{deliveryCharge}.00 BDT</span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-900 pt-1">
              <span>Total</span>
              <span className="text-[#f8931f]">{total}.00 BDT</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Special notes (Optional)</h3>
            <textarea 
              rows={2}
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="Note."
              className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs focus:outline-none focus:border-[#f8931f] resize-none"
            ></textarea>
          </div>

          <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 text-xs text-gray-800 space-y-2.5 leading-relaxed shadow-sm">
            <div className="flex items-center gap-2 font-bold text-amber-900 border-b border-amber-200/60 pb-2">
              <span className="text-base">⚠️</span> বিশেষ নির্দেশনা ও মহৎ উদ্যোগ
            </div>
            <p className="font-semibold text-gray-800">
              প্রিয় গ্রাহক, আপনি জেনেছেন আমাদের লভ্যাংশের টাকা দিয়ে অসহায় দুঃস্থ মানুষদের খাবারের ব্যবস্থা করা হবে, আপনিও আমাদের সেই মহৎ কাজের সঙ্গী হতে চলেছেন 🥀
            </p>
            <p className="text-rose-600 font-bold flex items-start gap-1.5">
              <span>❌</span> <span>বিনা প্রয়োজনে ফেইক অর্ডার করে এক টাকারও ক্ষতি করলে সেটা লভ্যাংশ থেকে কমে যাবে এবং সেই দায় আপনার উপরে থাকবে।</span>
            </p>
            <p className="text-emerald-700 font-bold flex items-start gap-1.5">
              <span>✅</span> <span>আপনার বিশ্বস্ততার জন্য সম্পূর্ণ ক্যাশ অন ডেলিভারিতে প্রোডাক্টটি পাঠানো হবে! ধন্যবাদ।</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="terms" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 accent-[#f8931f] rounded cursor-pointer" 
            />
            <label htmlFor="terms" className="text-[11px] text-gray-600 cursor-pointer">
              I have read and agree to the <span className="text-orange-600 underline">Terms and Conditions</span>, <span className="text-orange-600 underline">Privacy Policy</span> & <span className="text-orange-600 underline">Refund and Return Policy</span>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f8931f] hover:bg-[#e08219] text-white font-bold py-4 rounded-xl shadow-md transition cursor-pointer text-sm"
          >
            {loading ? 'প্রসেসিং হচ্ছে...' : `Submit Order (${total}.00 BDT)`}
          </button>
        </form>
      </div>
    </div>
  );
}