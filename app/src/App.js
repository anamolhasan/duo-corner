import React, { useContext } from 'react';
import { CartContext } from './context/CartContext';
import Cart from './components/Cart';
// Clerk থেকে লগ-ইনের বাটনগুলো নিয়ে আসলাম
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

function App() {
  const { addToCart, cartItems } = useContext(CartContext);

  const myProduct = {
    id: 1,
    name: "ম্যাচিং কাপল ঘড়ি",
    price: 1200
  };

  return (
    // পুরো ওয়েবসাইটকে ClerkProvider দিয়ে মুড়িয়ে দিলাম
    <ClerkProvider>
      <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
        
        {/* ওয়েবসাইটের হেডার এবং লগ-ইন বাটন */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f3f4f6', padding: '15px 20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>ডুও কর্নার স্টোর</h2>
          
          <div>
            <SignedOut>
              {/* ইউজার লগ-ইন না করা থাকলে এই বাটন দেখাবে */}
              <SignInButton mode="modal">
                <button style={{ padding: '10px 20px', background: '#6c47ff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                  লগ-ইন করুন
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              {/* ইউজার লগ-ইন করা থাকলে তার গোল প্রোফাইল ছবি দেখাবে */}
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* প্রোডাক্টের ডিজাইন */}
        <div style={{ border: '1px solid black', padding: '15px', width: '250px', borderRadius: '8px' }}>
          <h3>{myProduct.name}</h3>
          <p>দাম: ৳{myProduct.price}</p>
          
          <button 
            onClick={() => addToCart(myProduct)} 
            style={{ padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
          >
            Add to Cart
          </button>
        </div>

        <h3 style={{ marginTop: '30px', color: 'green' }}>
          কার্টে মোট প্রোডাক্ট আছে: {cartItems.length} টি
        </h3>

        <Cart /> 
        
      </div>
    </ClerkProvider>
  );
}

export default App;