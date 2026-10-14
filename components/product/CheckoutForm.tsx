'use client';
import { useState, useTransition } from 'react';
import { bangladeshData, merchantSpecialNote, taka, type Product } from '@/lib/data';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const inputClass =
  "w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-400 focus:outline-none transition placeholder:text-gray-400";

const labelClass = "block text-[11px] font-black text-gray-600 mb-1.5 uppercase tracking-wider";

const sectionTitleClass = "text-[11px] font-black uppercase tracking-widest text-rose-600 mb-3 flex items-center gap-1.5";

type CheckoutFormProps = {
  product: Product;
  onBackHome: () => void;
};

export default function CheckoutForm({ product, onBackHome }: CheckoutFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');

  const [selectedDistrict, setSelectedDistrict] = useState('Habiganj');
  const [selectedThana, setSelectedThana] = useState('Habiganj Sadar');

  const [formData, setFormData] = useState({ name: '', phone: '', address: '', note: '', trxId: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const deliveryCharge = deliveryArea === 'inside' ? 70 : 130;
  const productTotal = product.basePrice * quantity;
  const grandTotal = productTotal + deliveryCharge;

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedThana(bangladeshData[district]?.[0] || '');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ১. ফোন নম্বর অবশ্যই ১১ ডিজিটের হতে হবে
    if (formData.phone.length !== 11) {
      alert('দয়া করে সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন!');
      return;
    }

    // ২. জেলা, থানা এবং বিস্তারিত ঠিকানা পূরণ করা বাধ্যতামূলক
    if (!selectedDistrict || !selectedThana || !formData.address.trim()) {
      alert('দয়া করে জেলা, থানা এবং বিস্তারিত ঠিকানা অবশ্যই পূরণ করুন!');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/save-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            thana: selectedThana,
            district: selectedDistrict,
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
    <div id="one-page-checkout" className="rounded-3xl border border-rose-200/70 bg-rose-50/60 p-4 md:p-6">
      <h2 className="mb-1 text-xl font-black leading-snug text-gray-900">{product.name}</h2>
      <p className="mb-3 text-[11px] leading-relaxed text-gray-500">{product.description}</p>

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-rose-100 bg-white p-3 shadow-soft">
        <span className="text-2xl font-black text-rose-600">{taka(product.basePrice)}</span>
        <span className="text-sm font-semibold text-gray-400 line-through">{product.originalPrice}</span>
        <span className="ml-auto rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          COD Available
        </span>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ১. পরিমাণ ও ডেলিভারি */}
          <div>
            <p className={sectionTitleClass}>১. পরিমাণ ও ডেলিভারি</p>
            <div className="mb-2.5 flex items-center justify-between rounded-xl border border-rose-100/80 bg-white p-3">
              <span className="text-xs font-bold text-gray-700">Quantity (পরিমাণ)</span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="h-9 w-9 cursor-pointer rounded-lg border border-rose-200 bg-white text-base font-black leading-none text-rose-600 transition hover:bg-rose-50"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-black text-gray-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="h-9 w-9 cursor-pointer rounded-lg border border-rose-200 bg-white text-base font-black leading-none text-rose-600 transition hover:bg-rose-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryArea('inside')}
                className={`cursor-pointer rounded-xl border px-2 py-2.5 text-[11px] font-bold transition ${
                  deliveryArea === 'inside'
                    ? 'border-rose-600 bg-rose-600 text-white shadow-soft'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300'
                }`}
              >
                Inside Dhaka (৳70)
              </button>
              <button
                type="button"
                onClick={() => setDeliveryArea('outside')}
                className={`cursor-pointer rounded-xl border px-2 py-2.5 text-[11px] font-bold transition ${
                  deliveryArea === 'outside'
                    ? 'border-rose-600 bg-rose-600 text-white shadow-soft'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300'
                }`}
              >
                Outside Dhaka (৳130)
              </button>
            </div>
          </div>

          {/* ২. কন্টাক্ট ও ঠিকানা */}
          <div>
            <p className={sectionTitleClass}>২. কন্টাক্ট ও ঠিকানা</p>
            <div className="space-y-3">
              <div>
                <label htmlFor="order-name" className={labelClass}>Full Name (আপনার নাম)</label>
                <input
                  id="order-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Write your full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="order-phone" className={labelClass}>Phone Number (১১ ডিজিট)</label>
                <input
                  id="order-phone"
                  type="tel"
                  required
                  maxLength={11}
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="01712345678"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="order-district" className={labelClass}>District (জেলা)</label>
                  <select
                    id="order-district"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    required
                    className={`${inputClass} cursor-pointer`}
                  >
                    {Object.keys(bangladeshData).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="order-thana" className={labelClass}>Thana (থানা)</label>
                  <select
                    id="order-thana"
                    value={selectedThana}
                    onChange={e => setSelectedThana(e.target.value)}
                    required
                    className={`${inputClass} cursor-pointer`}
                  >
                    {bangladeshData[selectedDistrict]?.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="order-address" className={labelClass}>Detailed Address (ঠিকানা)</label>
                <input
                  id="order-address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House no, Road, Area"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ৩. বিল সামারি */}
          <div>
            <p className={sectionTitleClass}>৩. বিল সামারি</p>
            <div className="space-y-2 rounded-xl border border-rose-100/80 bg-white p-3.5 text-sm shadow-soft">
              <div className="flex justify-between text-gray-600">
                <span>Product Price</span>
                <span className="font-semibold text-gray-800">{taka(productTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span className="font-semibold text-gray-800">{taka(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between border-t border-dashed pt-2 text-sm font-black text-rose-600">
                <span>Grand Total</span>
                <span>{taka(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10px] font-bold leading-relaxed text-amber-900">
            {merchantSpecialNote}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 py-4 text-sm font-black text-white shadow-soft transition transform hover:from-rose-700 hover:to-pink-700 active:scale-95 disabled:opacity-60"
          >
            {isPending ? 'Processing...' : `✅ CONFIRM ORDER (${taka(grandTotal)})`}
          </button>
        </form>
      ) : (
        <div className="animate-fadeIn py-10 text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-2xl text-emerald-600 shadow-inner">
            ✓
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-800">Order Placed Successfully!</h3>
          <p className="mb-4 text-[11px] text-gray-600">আপনার অর্ডারটি আমাদের অ্যাডমিন প্যানেলে জমা হয়েছে।</p>
          <button
            onClick={onBackHome}
            className="cursor-pointer rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-rose-700"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}