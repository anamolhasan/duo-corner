'use client';
import { useState } from 'react';
import ProductGrid from '@/components/landing/ProductGrid';
import ProductDetail from '@/components/product/ProductDetail';
import type { Product } from '@/lib/data';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDetails = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {selectedProduct ? (
        <ProductDetail 
          product={selectedProduct} 
          onBack={handleBackToHome} 
        />
      ) : (
        <div>
          <ProductGrid 
            onDetails={handleDetails} 
            onOrder={(product) => handleDetails(product)} 
            searchQuery={searchQuery} 
          />
        </div>
      )}
    </main>
  );
}