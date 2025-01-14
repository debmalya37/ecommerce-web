"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function PaymentPage() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Retrieve user details and total amount from sessionStorage
    const user = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const total = parseFloat(sessionStorage.getItem('total') || '0');

    setUserDetails(user);
    setTotalAmount(total);
  }, []);

  const handlePayment = async () => {
    try {
      const response = await axios.post('/api/phonepe-payment', {
        amount: totalAmount,
        userDetails,
      });
  
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl; // Redirect to PhonePe payment page
      } else {
        console.error('Payment URL not returned');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Confirm Your Payment</h2>
      <p className="mt-4"><strong>Full Name:</strong> {userDetails?.fullName}</p>
      <p><strong>Email:</strong> {userDetails?.email}</p>
      <p><strong>Phone:</strong> {userDetails?.phone}</p>
      <p className="mt-4 text-xl"><strong>Total:</strong> ₹{totalAmount}</p>

      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white py-2 px-4 w-full mt-6 rounded-md hover:bg-blue-700"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
