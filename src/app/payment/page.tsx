"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function PaymentPage() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Retrieve user details and source from session storage
    const user = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const source = sessionStorage.getItem('source');

    setUserDetails(user);

    if (source === 'cart') {
      // Compute total from cart
      const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      const total = cart.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      setTotalAmount(total);
    } else if (source === 'buy-now') {
      // Compute total from selected product
      const product = JSON.parse(sessionStorage.getItem('selectedProduct') || '{}');
      const total = product.price * product.quantity || 0;
      setTotalAmount(total);
    }
  }, []);

  const handlePayment = async () => {
    try {
      const response = await axios.post('/api/phonepe-payment', {
        amount: totalAmount,
        userDetails,
      });

      if (response.data.redirect) {
        window.location.href = response.data.redirect;
      } else {
        console.error('Redirect URL not returned');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Confirm Your Payment</h2>
      <p><strong>Full Name:</strong> {userDetails?.fullName}</p>
      <p><strong>Email:</strong> {userDetails?.email}</p>
      <p><strong>Phone:</strong> {userDetails?.phone}</p>
      <p className="mt-4 text-xl"><strong>Total:</strong> ₹{totalAmount}</p>

      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white py-2 px-4 w-full mt-6 rounded-md"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
