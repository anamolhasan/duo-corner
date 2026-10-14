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
    }, 150);
  };

  // রিয়েল-টাইম সার্চ ফিল্টারিং লজিক
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="relative mx-auto min-h-screen max-w-md bg-gradient-to-b from-rose-50/50 via-white to-white pb-16 font-sans text-gray-900 md:max-w-4xl shadow-xl">
      <PromoBar />

      <Hero 
        onHome={() => { setViewMode('home'); setSearchQuery(''); }} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {viewMode === 'home' && (
        <>
          {searchQuery.trim() !== '' ? (
            <div className="px-4 mt-6">
              <div className="mb-4 flex items-center justify-between border-b border-rose-100 pb-2">
                <h3 className="text-xs font-black text-rose-600 uppercase tracking-wider">
                  🔍 সার্চ রেজাল্ট ({filteredProducts.length}টি পণ্য পাওয়া গেছে)
                </h3>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-gray-500 hover:text-rose-600 cursor-pointer"
                >
                  সব মুছুন ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="group rounded-[24px] border border-rose-100/80 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-3">
                      <img 
                        src={product.images[0] || '/parl.jpg'} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-rose-600 px-3 py-1 text-[10px] font-extrabold text-white shadow-sm">
                        {product.badge}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-base font-black text-rose-600">৳{product.basePrice}</span>
                        <span className="text-xs text-gray-400 line-through ml-2">{product.originalPrice}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        ✨ ক্যাশ অন ডেলিভারি
                      </span>
                    </div>

                    {/* প্রিমিয়াম ডিজাইনের বাটন */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenDetail(product)}
                        className="cursor-pointer rounded-xl border border-rose-200 bg-rose-50/50 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95 flex items-center justify-center gap-1 shadow-2xs"
                      >
                        👁️ বিস্তারিত দেখুন
                      </button>
                      <button
                        onClick={() => handleDirectOrder(product)}
                        className="cursor-pointer rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:from-rose-700 hover:to-pink-700 active:scale-95 flex items-center justify-center gap-1"
                      >
                        ⚡ দ্রুত অর্ডার করুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="py-16 text-center bg-white rounded-3xl border border-rose-100 p-6 shadow-xs my-4">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm font-bold text-gray-700 mb-1">দুঃখিত! আপনার সার্চ করা নামটি দিয়ে কোনো পণ্য পাওয়া যায়নি।</p>
                  <p className="text-xs text-gray-400 mb-4">সঠিক বানান লিখে আবার চেষ্টা করুন।</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 cursor-pointer"
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