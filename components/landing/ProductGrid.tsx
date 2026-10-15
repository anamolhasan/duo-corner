'use client';
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/data';
import { products as localProducts } from '@/lib/data';

type ProductGridProps = {
  onDetails: (product: Product) => void;
  onOrder: (product: Product) => void;
  searchQuery?: string;
};

export default function ProductGrid({ onDetails, onOrder, searchQuery = '' }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error("প্রোডাক্ট লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // রিয়েল-টাইম সার্চ ফিল্টারিং লজিক
  const filteredProducts = products.filter(product => {
    const prodName = product.name || (product as any).productName || (product as any)['Product Name'] || "";
    const prodDesc = product.description || (product as any).Description || "";
    return (
      prodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prodDesc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="text-center py-20 text-rose-500 font-bold">
        প্রোডাক্ট লোড হচ্ছে...
      </div>
    );
  }

  return (
    <section className="px-4 py-6">
      <h2 className="text-xl font-black text-gray-800 mb-4">আমাদের এক্সক্লুসিভ কালেকশন</h2>
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product, index) => {
          const prodId = product.id || index + 1;
          const prodName = product.name || (product as any).productName || (product as any)['Product Name'] || "Product";
          
          // গুগল শিটের সেল অনুযায়ী সঠিক প্রাইস ও ডিসকাউন্ট ম্যাপিং
          const regularPrice = Number((product as any).regularPrice || (product as any)['Regular Price'] || 999);
          const offerPrice = Number((product as any).offerPrice || (product as any)['Offer Price'] || product.basePrice || (product as any).price || 799);
          const discountPercent = regularPrice > offerPrice ? Math.round(((regularPrice - offerPrice) / regularPrice) * 100) : 0;

          const prodCategory = (product as any).category || (product as any)['Category'] || "Couple Item";
          
          // গুগল শিটের আলাদা আলাদা ইমেজের কলাম থেকে সঠিকভাবে ছবি তোলার লজিক
          let prodImage = "/parl.jpg";
          const colImg = (product as any)['Image URL1'] || (product as any).imageUrl1 || (product as any).image;
          
          // যদি প্রোডাক্ট অবজেক্টের ভেতরে images অ্যারে থাকে এবং সেখানে ছবি থাকে
          if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
            prodImage = product.images[0];
          } else if (colImg && typeof colImg === 'string' && colImg.trim() !== '') {
            prodImage = /^https?:\/\//i.test(colImg) ? colImg : '/' + colImg.replace(/^\/+/, '');
          }

          // যদি প্রথম প্রোডাক্ট বা দ্বিতীয় প্রোডাক্টের জন্য আলাদা ছবি শিটে দেওয়া থাকে তা নিশ্চিত করা
          if ((product as any)['Image URL1']) {
            let imgVal = String((product as any)['Image URL1']).trim();
            prodImage = imgVal.startsWith('/') ? imgVal : '/' + imgVal;
          }

          return (
            <div key={prodId} className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
              
              {/* ছবির ওপর ক্লিক করলে ডিটেইলস পেজে যাবে */}
              <div 
                onClick={() => onDetails(product)}
                className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer"
              >
                {/* আই-ক্যাচি ডিসকাউন্ট ব্যাজ */}
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
                  
                  {/* প্রোডাক্টের নামের ওপর ক্লিক করলে ডিটেইলস পেজে যাবে */}
                  <h3 
                    onClick={() => onDetails(product)}
                    className="text-xs sm:text-sm font-bold text-gray-800 mt-1.5 line-clamp-2 cursor-pointer hover:text-rose-600 transition"
                  >
                    {prodName}
                  </h3>
                </div>

                <div className="mt-3">
                  {/* অফার প্রাইস ফোকাস করার জন্য প্রিমিয়াম হাইলাইট বক্স */}
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-10 text-gray-500 text-sm">
          দুঃখিত! আপনার সার্চ করা নামটি দিয়ে কোনো পণ্য পাওয়া যায়নি।
        </div>
      )}
    </section>
  );
}