"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function PaymentPage() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [cart, setCart] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Retrieve cart and user details from sessionStorage
    const user = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const total = parseFloat(sessionStorage.getItem('total') || '0');

    setUserDetails(user);
    setCart(cartItems);
    setTotalAmount(total);
  }, []);

  const handlePayment = async () => {
    const paymentData = {
      amount: totalAmount,
      items: cart,
      userDetails: userDetails,
    };

    try {
      const response = await axios.post('/api/phonepe-payment', paymentData);
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        console.error('Payment URL not returned');
      }
    } catch (error) {
      console.error('Payment failed', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800">Confirm Your Payment</h2>
      <div className="space-y-4 mt-6">
        <p><strong>Full Name:</strong> {userDetails?.fullName}</p>
        <p><strong>Email:</strong> {userDetails?.email}</p>
        <p><strong>Phone:</strong> {userDetails?.phone}</p>
        <p><strong>Address:</strong> {userDetails?.address}</p>
        <p><strong>State:</strong> {userDetails?.state}</p>
        <p><strong>Country:</strong> India</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Cart Details:</h3>
        {cart.map((item: any, index: number) => (
          <div key={index} className="flex justify-between py-2">
            <span>{item.name}</span>
            <span>{item.price} x {item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xl font-semibold">Total: ₹{totalAmount}</div>

      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white py-2 px-4 w-full mt-6 rounded-md hover:bg-blue-700"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
