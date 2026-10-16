'use client';
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/data';
import { products as localProducts } from '@/lib/data';
import Loader from '@/components/Loader';

type ProductGridProps = {
  onDetails: (product: Product) => void;
  onOrder: (product: Product) => void;
  searchQuery?: string;
  selectedCategory?: string;
};

export default function ProductGrid({ onDetails, onOrder, searchQuery = '', selectedCategory = '' }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // প্রথমবার পেজ লোড হওয়ার ডেটা ফেচিং
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error("প্রোডাক্ট লোড করতে সমস্যা হয়েছে");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // সার্চ করার সময় আপনার সেই চমৎকার রোমান্টিক লোডার ইফেক্ট ট্রিগার করা
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 700); // ৭০০ মিলিসেকেন্ডের স্মুথ লোডিং ডিলে
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // সার্চ এবং ক্যাটাগরি ফিল্টারিং লজিক
  const filteredProducts = products.filter(product => {
    const prodName = product.name || (product as any).productName || (product as any)['Product Name'] || "";
    const prodDesc = product.description || (product as any).Description || "";
    const prodCat = (product as any).category || (product as any)['Category'] || "";

    const matchesSearch = 
      prodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prodDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prodCat.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory 
      ? prodCat.toLowerCase().includes(selectedCategory.toLowerCase())
      : true;

    return matchesSearch && matchesCategory;
  });

  // ১. আপনার সেই আসল গ্লোবাল রোমান্টিক কাপল ডান্স লোডার (পেজ বা সার্চ লোডিংয়ের সময় শো করবে)
  if (initialLoading || isSearching) {
    return <Loader />;
  }

  return (
    <section className="px-4 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-black text-gray-800">
          {selectedCategory ? `${selectedCategory} কালেকশন` : 'আমাদের এক্সক্লুসিভ কালেকশন'}
        </h2>
        <span className="text-xs text-gray-500 font-semibold">মোট ({filteredProducts.length}) টি পণ্য</span>
      </div>

      {/* ২. প্রোডাক্ট গ্রিড ডিসপ্লে */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product, index) => {
          const prodId = product.id || index + 1;
          const prodName = product.name || (product as any).productName || (product as any)['Product Name'] || "Product";
          
          const regularPrice = Number((product as any).regularPrice || (product as any)['Regular Price'] || 999);
          const offerPrice = Number((product as any).offerPrice || (product as any)['Offer Price'] || product.basePrice || (product as any).price || 799);
          const discountPercent = regularPrice > offerPrice ? Math.round(((regularPrice - offerPrice) / regularPrice) * 100) : 0;

          const prodCategory = (product as any).category || (product as any)['Category'] || "Couple Item";
          
          let prodImage = "/parl.jpg";
          const colImg = (product as any)['Image URL1'] || (product as any).imageUrl1 || (product as any).image;
          
          if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
            prodImage = product.images[0];
          } else if (colImg && typeof colImg === 'string' && colImg.trim() !== '') {
            prodImage = /^https?:\/\//i.test(colImg) ? colImg : '/' + colImg.replace(/^\/+/, '');
          }

          if ((product as any)['Image URL1']) {
            let imgVal = String((product as any)['Image URL1']).trim();
            prodImage = imgVal.startsWith('/') ? imgVal : '/' + imgVal;
          }

          return (
            <div key={prodId} className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
              
              <div 
                onClick={() => onDetails(product)}
                className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer"
              >
                {discountPercent > 0 && (
                  <span className="absolute top-2.5 left-2.5 z-10 bg-gradient-to-r from-rose-600 to-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-lg tracking-wider animate-pulse">
                    🔥 {discountPercent}% OFF
                  </span>
                )}
                <img 
                  src={prodImage} 
                  alt={prodName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/parl.jpg";
                  }}
                />
              </div>

              <div className="p-3.5 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                    {prodCategory}
                  </span>
                  
                  <h3 
                    onClick={() => onDetails(product)}
                    className="text-xs sm:text-sm font-bold text-gray-800 mt-1.5 line-clamp-2 cursor-pointer hover:text-rose-600 transition"
                  >
                    {prodName}
                  </h3>
                </div>

                <div className="mt-3">
                  <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/60 p-2 rounded-xl mb-3 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-[9px] font-black text-rose-600 uppercase tracking-wider block">বিশেষ মূল্য</span>
                      <span className="text-lg sm:text-xl font-black text-rose-600 tracking-tight leading-none">
                        ৳{offerPrice}
                      </span>
                    </div>
                    {regularPrice > offerPrice && (
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">নিয়মিত মূল্য</span>
                        <span className="text-xs font-bold text-gray-400 line-through">
                          ৳{regularPrice}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button 
                      onClick={() => onDetails(product)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2 rounded-xl transition cursor-pointer"
                    >
                      বিস্তারিত
                    </button>
                    <button 
                      onClick={() => onOrder(product)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer shadow-sm"
                    >
                      অর্ডার
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ৩. যদি সার্চ বা ক্যাটাগরিতে কোনো পণ্য না পাওয়া যায়: ভিডিও স্টাইল সরি প্লেকার্ড অ্যানিমেশন */}
      {filteredProducts.length === 0 && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
          <div className="relative w-full max-w-sm aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black border border-[#D4AF37]/40 shadow-2xl flex flex-col items-center justify-center p-6">
            
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay pointer-events-none"
            >
              <source src="/couple-sorry.mp4" type="video/mp4" />
            </video>

            <div className="relative z-10 flex flex-col items-center space-y-3">
              <span className="text-3xl animate-bounce">👩‍❤️‍👨</span>
              <div className="bg-gradient-to-r from-rose-600 to-orange-500 text-white text-[11px] font-black px-4 py-1 rounded-full shadow-lg tracking-wider uppercase animate-pulse">
                Sorry 😞
              </div>
            </div>
          </div>

          <div className="space-y-2 max-w-md">
            <h3 className="text-base sm:text-lg font-black text-gray-800 tracking-wide">
              এমন ফলাফল পাওয়া যায়নি
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              আপনার সার্চ করা নাম বা কিওয়ার্ড দিয়ে আমাদের স্টোরে এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক বানানে বা অন্য কিছু দিয়ে আবার সার্চ করুন।
            </p>
          </div>
        </div>
      )}
    </section>
  );
}