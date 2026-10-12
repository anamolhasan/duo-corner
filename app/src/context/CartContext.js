import React, { createContext, useState } from 'react';

// ১. একটি Context তৈরি করা হলো (এটি আমাদের কার্টের মেমোরি হিসেবে কাজ করবে)
export const CartContext = createContext();

// ২. Provider তৈরি করা হলো (এটি কার্টের ডাটা ওয়েবসাইটের সব জায়গায় পৌঁছে দেবে)
export function CartProvider({ children }) {
  // শুরুতে আমাদের কার্ট একদম ফাঁকা থাকবে, তাই [] ব্যবহার করেছি
  const [cartItems, setCartItems] = useState([]); 

  // ৩. কার্টে প্রোডাক্ট যোগ করার ফাংশন
  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    alert("প্রোডাক্ট কার্টে যোগ হয়েছে!"); // বোঝার সুবিধার জন্য একটি ছোট মেসেজ
  };

  // ৪. সব ডাটা প্রোভাইড করা হচ্ছে
  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}