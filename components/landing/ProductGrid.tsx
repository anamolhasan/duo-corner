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
    const prodName = product.name || (product as any).productName || (product as any).Name || "";
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
          const prodName = product.name || (product as any).productName || (product as any).Name || "Product";
          const prodPrice = Number((product as any).basePrice || product.basePrice || (product as any).price || (product as any).Price || 799);
          const prodCategory = (product as any).category || (product as any).Category || "Couple Item";
          
          let prodImage = "/parl.jpg";
          if (Array.isArray(product.images) && product.images.length > 0) {
            prodImage = product.images[0];
          } else if ((product as any).image) {
            prodImage = (product as any).image;
          }

          return (
            <div key={prodId} className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden flex flex-col">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img 
                  src={prodImage} 
                  alt={prodName} 
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-3 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                    {prodCategory}
                  </span>
                  <h3 className="text-sm font-bold text-gray-800 mt-1 line-clamp-2">
                    {prodName}
                  </h3>
                </div>

                <div className="mt-3">
                  <span className="text-base font-black text-gray-900 block mb-2">
                    ৳{prodPrice}
                  </span>
                  <div className="grid grid-cols-2 gap-1">
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