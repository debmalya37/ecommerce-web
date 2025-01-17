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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 text-white flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">
          Confirm Your Payment
        </h2>
        <div className="space-y-4">
          <p>
            <strong>Full Name:</strong> {userDetails?.fullName}
          </p>
          <p>
            <strong>Email:</strong> {userDetails?.email}
          </p>
          <p>
            <strong>Phone:</strong> {userDetails?.phone}
          </p>
          <p className="text-2xl font-bold text-purple-700 text-center">
            Total: ₹{totalAmount}
          </p>
        </div>
        <button
          onClick={handlePayment}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold w-full mt-6 shadow-md transform hover:scale-105 transition duration-300"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
