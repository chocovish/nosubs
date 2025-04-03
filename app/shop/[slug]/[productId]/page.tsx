'use client';

import { useState, useEffect, use } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { getProductById } from '@/app/actions/products';
import { ShoppingCart, ArrowLeft, Tag, Shield, Download, CheckCircle, Store } from 'lucide-react';
import Link from 'next/link';
import { initializePayment, verifyPayment } from '@/app/actions/payment';
import { PurchaseDialog } from '@/components/ui/purchase-dialog';
import { DownloadDialog } from '@/components/ui/download-dialog';
import prisma from '@/lib/prisma';
import { getUserBySlug } from '@/app/actions/profile';

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  fileUrl: string;
  isVisible: boolean;
};

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string; productId: string }> }) {
  const { slug, productId } = use(params);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center space-y-4 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          <Link 
            href={`/shop/${slug}`}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>
    );
  }



  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      const paymentData = await initializePayment(productId, slug);

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: product.title,
        description: product.description,
        order_id: paymentData.orderId,
        handler: async function (response: any) {
          try {
            const result = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              productId: productId,
              sellerId: (await getUserBySlug(slug))!,
              guestInfo: undefined
            });
            if (result?.fileUrl) {
              setDownloadUrl(result.fileUrl);
              setIsDownloadDialogOpen(true);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: product.title,
          email: product.title
        },
        theme: {
          color: '#7C3AED'
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setIsLoading(false);
      setIsPurchaseDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back to Shop Link */}
        <Link 
          href={`/shop/${slug}`}
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Shop</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-purple-600 text-lg">
                  ${product.price}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Store className="w-6 h-6 text-purple-600" />
                <span className="text-gray-600 font-medium">{slug}'s Store</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {product.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
              <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <Shield className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Secure Purchase</h3>
                  <p className="text-sm text-gray-600">Protected by our secure payment system</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <Download className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Instant Download</h3>
                  <p className="text-sm text-gray-600">Get immediate access after purchase</p>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <Button
              onClick={() => setIsPurchaseDialogOpen(true)}
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Buy Now - ${product.price}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Purchase Dialog */}
        <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Confirm Purchase
              </h3>
              <p className="text-gray-600">
                You are about to purchase {product.title} for ${product.price}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isLoading ? 'Processing...' : 'Confirm Purchase'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsPurchaseDialogOpen(false)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <DownloadDialog
          isOpen={isDownloadDialogOpen}
          onClose={() => setIsDownloadDialogOpen(false)}
          onDownload={() => {
            if (downloadUrl) {
              window.location.href = downloadUrl;
            }
          }}
          productTitle={product.title}
        />
      </div>
    </div>
  );
}