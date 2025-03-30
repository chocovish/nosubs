import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/app/actions/payment';
import { PhonePe } from '@phonepe/sdk';

const phonepe = new PhonePe({
  merchantId: process.env.PHONEPE_MERCHANT_ID!,
  merchantKey: process.env.PHONEPE_MERCHANT_KEY!,
  env: process.env.NODE_ENV === 'production' ? 'prod' : 'stage'
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Verify callback signature using SDK
    const isValidCallback = phonepe.verifyCallback(data);
    
    if (!isValidCallback) {
      throw new Error('Invalid callback signature');
    }

    const result = await verifyPayment(
      data.merchantTransactionId,
      data.productId,
      data.sellerId
    );

    if (result.success) {
      // Redirect to success page with download URL
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?fileUrl=${encodeURIComponent(result.fileUrl)}`
      );
    } else {
      // Redirect to failure page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`
      );
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`
    );
  }
} 