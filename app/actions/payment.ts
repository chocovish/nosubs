'use server';

import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { auth } from '../../lib/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

type GuestBuyer = {
  email: string;
  name: string;
};

export async function initializePayment(productId: string, sellerId: string, guestInfo?: GuestBuyer) {
  try {
    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isVisible) {
      throw new Error('Product not found');
    }

    // Create Razorpay order
    console.log(`o_${productId}_${Date.now()}`, `o_${productId}_${Date.now()}`.length)
    const order = await razorpay.orders.create({
      amount: Math.round(product.price * 100), // Convert to smallest currency unit (paise)
      currency: 'INR',
      receipt: `${productId}_${Date.now()}`,
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    };
  } catch (error) {
    console.error('Payment initialization error:', error);
    throw new Error('Failed to initialize payment');
  }
}

export async function verifyPayment({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  productId,
  sellerId,
  guestInfo
}: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  productId: string;
  sellerId: string;
  guestInfo?: GuestBuyer;
}) {
  try {
    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid payment signature');
    }

    // Get session to check if user is logged in
    const session = await auth();
    const buyerId = session?.user?.id || null;

    // Record the sale
    const amount = (await razorpay.payments.fetch(razorpay_payment_id)).amount;
    if (typeof amount !== 'number') {
      return 
    }
    const sale = await prisma.sale.create({
      data: {
        productId,
        sellerId,
        buyerId,
        amount: amount / 100,
        razorpayId: razorpay_payment_id,
        status: 'completed',
      },
    });

    // Get product details for download
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { fileUrl: true },
    });

    return {
      success: true,
      fileUrl: product?.fileUrl,
      saleId: sale.id,
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
}