'use client';
import { useState, useEffect, type ComponentType } from 'react';
import { getProducts, type Product } from '@/lib/data';
import PromoBar from '@/components/landing/PromoBar';
import Hero from '@/components/landing/Hero';
import ProductGrid from '@/components/landing/ProductGrid';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import ProductDetail from '@/components/product/ProductDetail';

const ProductDetailView = ProductDetail as ComponentType<{
  product: Product;
  onBack?: () => void;
  onBackHome?: () => void;
}>;

export default function Home() {
  const [viewMode, setViewMode] = useState<'home' | 'detail'>('home');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>([]);

  // গুগল শিট থেকে লাইভ প্রোডাক্ট ফেচ করার জন্য useEffect
  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      if (data && data.length > 0) {
        setDynamicProducts(data);
      }
    }
    loadProducts();
  }, []);

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

  return (
    <main className="relative mx-auto min-h-screen max-w-md bg-gradient-to-b from-rose-50/50 via-white to-white pb-16 font-sans text-gray-900 md:max-w-4xl shadow-xl">
      <PromoBar />

      <Hero 
        onHome={() => { setViewMode('home'); setSearchQuery(''); }} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {viewMode === 'home' && (
        <ProductGrid 
          onDetails={handleOpenDetail} 
          onOrder={handleDirectOrder} 
          searchQuery={searchQuery}
          productsOverride={dynamicProducts.length > 0 ? dynamicProducts : undefined}
        />
      )}

      {viewMode === 'detail' && activeProduct && (
        <ProductDetailView
          product={activeProduct}
          onBack={() => setViewMode('home')}
          onBackHome={() => setViewMode('home')}
        />
      )}

      <Footer />

      <WhatsAppButton />
    </main>
  );
}