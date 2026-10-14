'use client';
import { useState, useTransition } from 'react';
import { divisionData, merchantSpecialNote, type Product } from '@/lib/data';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const inputClass =
  "w-full px-4 py-3 rounded-2xl border border-rose-200 bg-white/90 text-sm font-medium text-gray-800 shadow-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-400 focus:outline-none transition-all placeholder:text-gray-400";

const labelClass = "block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5";

const sectionTitleClass = "text-xs font-black uppercase tracking-wider text-rose-600 mb-3.5 flex items-center gap-2 bg-rose-50/90 px-3.5 py-2.5 rounded-xl border border-rose-100";

type CheckoutFormProps = {
  product: Product;
  onBackHome: () => void;
};

export default function CheckoutForm({ product, onBackHome }: CheckoutFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');

  // বিভাগ, জেলা এবং থানার ডাইনামিক স্টেট (সরকারি তালিকা অনুযায়ী)
  const divisions = Object.keys(divisionData);
  const [selectedDivision, setSelectedDivision] = useState(divisions[0] || 'ঢাকা');

  const districts = Object.keys(divisionData[selectedDivision] || {});
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0] || '');

  const thanas = divisionData[selectedDivision]?.[selectedDistrict] || [];
  const [selectedThana, setSelectedThana] = useState(thanas[0] || '');

  const [formData, setFormData] = useState({ name: '', phone: '', address: '', note: '', trxId: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const deliveryCharge = selectedDivision === 'ঢাকা' ? 70 : 130;
  const productTotal = product.basePrice * quantity;
  const grandTotal = productTotal + deliveryCharge;

  // বিভাগ বদলালে জেলার লিস্ট ও প্রথম জেলা সিলেক্ট হবে
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const division = e.target.value;
    setSelectedDivision(division);
    const newDistricts = Object.keys(divisionData[division] || {});
    const firstDistrict = newDistricts[0] || '';
    setSelectedDistrict(firstDistrict);
    const newThanas = divisionData[division]?.[firstDistrict] || [];
    setSelectedThana(newThanas[0] || '');
  };

  // জেলা বদলালে থানার লিস্ট ও প্রথম থানা সিলেক্ট হবে
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    const newThanas = divisionData[selectedDivision]?.[district] || [];
    setSelectedThana(newThanas[0] || '');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('দয়া করে আপনার সম্পূর্ণ নাম লিখুন!');
      document.getElementById('order-name')?.focus();
      return;
    }

    const cleanPhone = formData.phone.trim();
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      alert('দয়া করে সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)!');
      document.getElementById('order-phone')?.focus();
      return;
    }

    if (!selectedDivision) {
      alert('দয়া করে বিভাগ সিলেক্ট করুন!');
      document.getElementById('order-division')?.focus();
      return;
    }

    if (!selectedDistrict) {
      alert('দয়া করে জেলা সিলেক্ট করুন!');
      document.getElementById('order-district')?.focus();
      return;
    }

    if (!selectedThana) {
      alert('দয়া করে থানা সিলেক্ট করুন!');
      document.getElementById('order-thana')?.focus();
      return;
    }

    if (!formData.address.trim()) {
      alert('দয়া করে এলাকার নাম বা বাসা/রোড নম্বর লিখুন!');
      document.getElementById('order-address')?.focus();
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/save-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            phone: cleanPhone,
            division: selectedDivision,
            district: selectedDistrict,
            thana: selectedThana,
            productName: product.name,
            quantity,
            deliveryCharge,
            totalPrice: grandTotal,
            paymentMethod: 'cod',
          }),
        });

        const data = await res.json();
        if (data.success) {
          setIsSubmitted(true);
          window.fbq?.('track', 'Purchase', { value: grandTotal, currency: 'BDT' });
        } else {
          alert('অর্ডার সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        }
      } catch {
        alert('সার্ভার এরর!');
      }
    });
  };

  return (
    <div id="one-page-checkout" className="relative rounded-[32px] border border-rose-200/90 bg-gradient-to-br from-white via-rose-50/60 to-pink-100/50 p-5 md:p-8 shadow-2xl shadow-rose-900/10 backdrop-blur-md overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক বা প্রিমিয়াম ডিজাইন প্যাটার্ন */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-rose-400/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-pink-400/10 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-4 border-b border-rose-100 pb-4">
          <h2 className="text-xl font-black leading-snug text-gray-900">{product.name}</h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{product.description}</p>
        </div>

        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-rose-100 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
          <span className="text-2xl font-black text-rose-600">৳{product.basePrice}</span>
          <span className="text-sm font-semibold text-gray-400 line-through">{product.originalPrice}</span>
          <span className="ml-auto rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1 shadow-2xs">
            <span>✨</span> ক্যাশ অন ডেলিভারি
          </span>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ১. পরিমাণ ও ডেলিভারি */}
            <div>
              <p className={sectionTitleClass}>
                <span>📦</span> ১. পরিমাণ ও ডেলিভারি মাধ্যম
              </p>
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-rose-100/90 bg-white/90 p-4 shadow-xs">
                <span className="text-xs font-bold text-gray-700">পণ্য সংখ্যা (Quantity)</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="h-9 w-9 cursor-pointer rounded-xl border border-rose-200 bg-rose-50 text-base font-black text-rose-600 transition hover:bg-rose-100 active:scale-95"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-black text-gray-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="h-9 w-9 cursor-pointer rounded-xl border border-rose-200 bg-rose-50 text-base font-black text-rose-600 transition hover:bg-rose-100 active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeliveryArea('inside')}
                  className={`cursor-pointer rounded-2xl border px-3 py-3 text-xs font-bold transition-all shadow-xs ${
                    deliveryArea === 'inside'
                      ? 'border-rose-600 bg-rose-600 text-white shadow-rose-200 shadow-md'
                      : 'border-rose-100 bg-white/90 text-gray-700 hover:border-rose-300'
                  }`}
                >
                  🏠 ঢাকার ভেতরে (৳৭০)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryArea('outside')}
                  className={`cursor-pointer rounded-2xl border px-3 py-3 text-xs font-bold transition-all shadow-xs ${
                    deliveryArea === 'outside'
                      ? 'border-rose-600 bg-rose-600 text-white shadow-rose-200 shadow-md'
                      : 'border-rose-100 bg-white/90 text-gray-700 hover:border-rose-300'
                  }`}
                >
                  🚚 ঢাকার বাইরে (৳১৩০)
                </button>
              </div>
            </div>

            {/* ২. কন্টাক্ট ও ঠিকানা */}
            <div>
              <p className={sectionTitleClass}>
                <span>📍</span> ২. কন্টাক্ট ও ডেলিভারি ঠিকানা
              </p>
              <div className="space-y-3.5">
                <div>
                  <label htmlFor="order-name" className={labelClass}>
                    <span>👤</span> আপনার নাম (Full Name) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="order-name"
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: রাহিম আহমেদ"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="order-phone" className={labelClass}>
                    <span>📞</span> মোবাইল নম্বর (১১ ডিজিট) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="order-phone"
                    type="tel"
                    maxLength={11}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="01712345678"
                    className={inputClass}
                  />
                </div>

                {/* বিভাগ ও জেলা ড্রপডাউন */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="order-division" className={labelClass}>
                      <span>🗺️</span> বিভাগ (Division) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="order-division"
                      value={selectedDivision}
                      onChange={handleDivisionChange}
                      className={`${inputClass} cursor-pointer`}
                    >
                      {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="order-district" className={labelClass}>
                      <span>🏙️</span> জেলা (District) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="order-district"
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      className={`${inputClass} cursor-pointer`}
                    >
                      {districts.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                    </select>
                  </div>
                </div>

                {/* থানা ড্রপডাউন */}
                <div>
                  <label htmlFor="order-thana" className={labelClass}>
                    <span>🏡</span> থানা / উপজেলা (Thana) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="order-thana"
                    value={selectedThana}
                    onChange={e => setSelectedThana(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {thanas.map(thana => <option key={thana} value={thana}>{thana}</option>)}
                  </select>
                </div>

                {/* থানা/উপজেলার ঠিক নিচে সুদৃশ্য ও কম্প্যাক্ট ছোট ঠিকানা লেখার ঘর */}
                <div>
                  <label htmlFor="order-address" className={labelClass}>
                    <span>✍️</span> এলাকার নাম / বাসা বা রোড নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="order-address"
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="যেমন: কলেজ রোড / বাসা নং ১২"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* ৩. বিল সামারি */}
            <div>
              <p className={sectionTitleClass}>
                <span>💳</span> ৩. পেমেন্ট ও বিল সামারি
              </p>
              <div className="space-y-2.5 rounded-2xl border border-rose-100/90 bg-white/90 p-4 text-sm shadow-xs backdrop-blur-sm">
                <div className="flex justify-between text-gray-600 text-xs font-medium">
                  <span>পণ্য মূল্য (Product Price)</span>
                  <span className="font-bold text-gray-800">৳{productTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs font-medium">
                  <span>ডেলিভারি চার্জ (Delivery Charge)</span>
                  <span className="font-bold text-gray-800">৳{deliveryCharge}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-rose-100 pt-2 text-sm font-black text-rose-600">
                  <span>সর্বমোট প্রদেয় (Grand Total)</span>
                  <span className="text-base">৳{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* আপনার সেই আগের সুন্দর ও সাজানো-গুছানো ডিজাইন করা বিশেষ নোট */}
            <div className="bg-amber-50/95 border border-amber-200/90 rounded-2xl p-4 text-xs text-gray-800 space-y-2.5 leading-relaxed shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 font-bold text-amber-900 border-b border-amber-200/70 pb-2">
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

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 py-4 text-sm font-black text-white shadow-lg shadow-rose-600/30 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-60"
            >
              {isPending ? 'অর্ডার প্রসেসিং হচ্ছে...' : `✅ অর্ডার কনফার্ম করুন (৳${grandTotal})`}
            </button>
          </form>
        ) : (
          <div className="animate-fadeIn py-12 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-3xl text-emerald-600 shadow-inner">
              🎉
            </div>
            <h3 className="mb-1 text-xl font-black text-gray-800">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</h3>
            <p className="mb-5 text-xs text-gray-600">আপনার অর্ডারটি আমাদের সিস্টেমে সফলভাবে জমা হয়েছে। খুব শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।</p>
            <button
              onClick={onBackHome}
              className="cursor-pointer rounded-2xl bg-rose-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700"
            >
              হোমপেজে ফিরে যান
            </button>
          </div>
        )}
      </div>
    </div>
  );
}