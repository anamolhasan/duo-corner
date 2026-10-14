'use client';
import { useState } from 'react';
import type { Product } from '@/lib/data';
import { products } from '@/lib/data';
import PromoBar from '@/components/landing/PromoBar';
import Hero from '@/components/landing/Hero';
import ProductGrid from '@/components/landing/ProductGrid';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import ProductDetail from '@/components/product/ProductDetail';

export default function Home() {
  const [viewMode, setViewMode] = useState<'home' | 'detail'>('home');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenDetail = (product: Product) => {
    setActiveProduct(product);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectOrder = (product: Product) => {
    setActiveProduct(product);
    setViewMode('detail');
    setTimeout(() => {
      const formElement = document.getElementById('one-page-checkout');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // সার্চ কুয়েরি অনুযায়ী প্রোডাক্ট ফিল্টার করার লজিক
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="relative mx-auto min-h-screen max-w-md bg-gradient-to-b from-rose-50/50 via-white to-white pb-16 font-sans text-gray-900 md:max-w-4xl shadow-xl">
      <PromoBar />

      {/* হিরো কম্পোনেন্টে সার্চ স্টেট পাস করা হলো */}
      <Hero 
        onHome={() => { setViewMode('home'); setSearchQuery(''); }} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {viewMode === 'home' && (
        <>
          {/* যদি সার্চ করা হয়, তবে ফিল্টার করা প্রোডাক্টগুলো দেখানো হবে */}
          {searchQuery ? (
            <div className="px-4 mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  সার্চ রেজাল্ট ({filteredProducts.length})
                </h3>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  সব দেখান ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="group rounded-3xl border border-rose-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-3">
                      <img 
                        src={product.images[0] || '/parl.jpg'} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                        {product.badge}
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-base font-black text-rose-600">৳{product.basePrice}</span>
                        <span className="text-xs text-gray-400 line-through ml-2">{product.originalPrice}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        COD Available
                      </span>
                    </div>

                    {/* প্রফেশনাল ও ইউনিক স্টাইলের বাটন */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenDetail(product)}
                        className="cursor-pointer rounded-xl border border-rose-200 bg-rose-50/50 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95"
                      >
                        👁️ বিস্তারিত দেখুন
                      </button>
                      <button
                        onClick={() => handleDirectOrder(product)}
                        className="cursor-pointer rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:from-rose-700 hover:to-pink-700 active:scale-95"
                      >
                        ⚡ দ্রুত অর্ডার করুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-sm font-semibold text-gray-500 mb-2">দুঃখিত! আপনার সার্চ করা নামটি দিয়ে কোনো পণ্য পাওয়া যায়নি।</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700"
                  >
                    সকল পণ্য দেখুন
                  </button>
                </div>
              )}
            </div>
          ) : (
            <ProductGrid onDetails={handleOpenDetail} onOrder={handleDirectOrder} />
          )}
        </>
      )}

      {viewMode === 'detail' && activeProduct && (
        <ProductDetail product={activeProduct} onBack={() => setViewMode('home')} />
      )}

      <Footer />

      <WhatsAppButton />
    </main>
  );
}