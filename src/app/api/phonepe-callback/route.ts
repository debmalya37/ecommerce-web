import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const phonePeSignature = request.headers.get('x-verify') || '';

    // Verify signature
    const saltKey = process.env.PHONEPE_SALT_KEY || '';
    const expectedSignature = crypto.createHash('sha256').update(body + saltKey).digest('hex');

    if (phonePeSignature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const paymentStatus = JSON.parse(body);
    console.log('Payment Status:', paymentStatus);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Callback handling error:', error);
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 });
  }
}
