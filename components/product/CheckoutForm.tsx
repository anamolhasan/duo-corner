'use client';

type CheckoutFormProps = {
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  selectedDivision: string;
  handleDivisionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  divisions: string[];
  selectedDistrict: string;
  handleDistrictChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  districts: string[];
  selectedThana: string;
  setSelectedThana: (val: string) => void;
  thanas: string[];
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  coupon: string;
  setCoupon: (val: string) => void;
  specialNote: string;
  setSpecialNote: (val: string) => void;
  agreed: boolean;
  setAgreed: (val: boolean) => void;
  loading: boolean;
  handleOrderSubmit: (e: React.FormEvent) => void;
  productName: string;
  offerPrice: number;
  regularPrice: number;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  selectedImage: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
};

export default function CheckoutForm({
  fullName,
  setFullName,
  phone,
  setPhone,
  address,
  setAddress,
  selectedDivision,
  handleDivisionChange,
  divisions,
  selectedDistrict,
  handleDistrictChange,
  districts,
  selectedThana,
  setSelectedThana,
  thanas,
  paymentMethod,
  setPaymentMethod,
  coupon,
  setCoupon,
  specialNote,
  setSpecialNote,
  agreed,
  setAgreed,
  loading,
  handleOrderSubmit,
  productName,
  offerPrice,
  regularPrice,
  quantity,
  setQuantity,
  selectedImage,
  subtotal,
  deliveryCharge,
  total
}: CheckoutFormProps) {
  return (
    <div id="one-page-checkout" className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-200 scroll-mt-6 font-sans">
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
                maxLength={11}
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
  );
}