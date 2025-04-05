'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

interface ShopHeaderProps {
  shopName: string;
}

export default function ShopHeader({ shopName }: ShopHeaderProps) {
  const params = useParams();
  const pathname = usePathname();
  const slug = params?.slug as string;
  
  // Check if we're on the product page (has productId in params)
  const isProductPage = params?.productId !== undefined;
  
  return (
    <div className="py-4 px-4 sm:px-6 w-full bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-1/3">
          {isProductPage && (
            <Link 
              href={`/shop/${slug}`}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 group"
            >
              <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium max-sm:text-lg max-sm:hidden">Back to Shop</span>
            </Link>
          )}
        </div>
        
        <div className="w-1/3 text-center">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {shopName}
          </h1>
        </div>
        
        <div className="w-1/3">
          {/* Right side - can be used for additional elements if needed */}
        </div>
      </div>
    </div>
  );
} 