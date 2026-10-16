import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
// আমাদের বানানো ডাটাবেসের কানেকশনটা ইম্পোর্ট করলাম
import { supabase } from '../lib/supabaseClient'; 

function Cart() {
  const { cartItems } = useContext(CartContext);
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  // এই ফাংশনটি কার্টের ডাটা Supabase-এ পাঠাবে
  const saveToDatabase = async () => {
    if (cartItems.length === 0) {
      alert("আপনার কার্ট ফাঁকা!");
      return;
    }

    alert("ডাটাবেসে সেভ হচ্ছে, একটু অপেক্ষা করুন...");

    // Supabase-এর 'Carts' টেবিলে ডাটা পাঠানোর কোড
    const { error } = await supabase
      .from('Carts') 
      .insert([
        {
          total_price: totalPrice,
          items: cartItems 
        }
      ]);

    if (error) {
      alert("ডাটা সেভ হতে সমস্যা হয়েছে: " + error.message);
    } else {
      alert("✅ আপনার অর্ডার সফলভাবে ডাটাবেসে সেভ হয়েছে!");
    }
  };

  return (
    <div style={{ marginTop: '40px', padding: '20px', border: '2px solid green', borderRadius: '8px' }}>
      <h2>🛒 আপনার কার্ট</h2>
      
      {cartItems.length === 0 ? (
        <p>আপনার কার্ট একদম ফাঁকা!</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} style={{ fontSize: '18px', marginBottom: '10px' }}>
                {item.name} - {item.price}
              </li>
            ))}
          </ul>
          <hr />
          <h3>মোট বিল: ৳{totalPrice}</h3>

          {/* এই বাটনে ক্লিক করলেই ডাটাবেসে ডাটা যাবে */}
          <button 
            onClick={saveToDatabase} 
            style={{ padding: '12px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
          >
            Checkout (অর্ডার কনফার্ম করুন)
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;