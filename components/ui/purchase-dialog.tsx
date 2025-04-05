'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { Card } from './card';
import { Input } from './input';
import { Label } from './label';
import { useUser } from '@/hooks/use-user';

type PurchaseDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  sellerId: string;
  price: number;
  onPurchase: (isAnonymous: boolean, guestInfo?: { name: string; email: string } | undefined) => void;
};

export function PurchaseDialog({
  isOpen,
  onClose,
  productId,
  sellerId,
  price,
  onPurchase,
}: PurchaseDialogProps) {
  const [purchaseType, setPurchaseType] = useState<'anonymous' | 'login' | null>(null);
  const router = useRouter();
  const user = useUser();

  if (!isOpen) return null;

  const handleAnonymousPurchase = () => {
    onPurchase(true);
  };

  const handleLoginPurchase = () => {
    if (user) {
      onPurchase(false);
    } else {
      router.push(`/login?redirect=/shop/${sellerId}/${productId}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        {!purchaseType ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">How would you like to purchase?</h2>
            <div className="grid gap-4">
              <Button
                onClick={() => setPurchaseType('anonymous')}
                className="w-full"
                variant="outline"
              >
                Purchase Anonymously
              </Button>
              <Button
                onClick={() => setPurchaseType('login')}
                className="w-full"
              >
                Login to Purchase
              </Button>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        ) : purchaseType === 'anonymous' ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Anonymous Purchase</h2>
            <p className="text-center text-gray-600">
              You can purchase this product without providing any personal information.
            </p>
            <Button
              onClick={handleAnonymousPurchase}
              className="w-full"
            >
              Continue to Payment - ${price}
            </Button>
            <Button
              onClick={() => setPurchaseType(null)}
              variant="ghost"
              className="w-full"
            >
              Back
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Login to Purchase</h2>
            <p className="text-center text-gray-600">
              Please log in to continue with your purchase
            </p>
            <Button
              onClick={handleLoginPurchase}
              className="w-full"
            >
              Continue to Login
            </Button>
            <Button
              onClick={() => setPurchaseType(null)}
              variant="ghost"
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}