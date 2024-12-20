import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  const { amount, items } = await req.json();

  // Example payload for PhonePe payment API
  const paymentData = {
    amount: amount,
    items: items,
    currency: 'INR',  // Assuming payment is in INR
    customerInfo: {
      email: 'customer@example.com',
      phone: '9999999999',
    },
    callbackUrl: 'https://your-site.com/payment/success', // Callback URL after payment
    redirectUrl: 'https://your-site.com/payment/failure', // URL on failure
  };

  try {
    // Replace with actual PhonePe API endpoint
    const response = await axios.post('https://api.phonepe.com/v3/transaction', paymentData);

    // Return the payment URL for redirection
    return NextResponse.json({ paymentUrl: response.data.paymentUrl });
  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
