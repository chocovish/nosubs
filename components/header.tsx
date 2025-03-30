'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useState } from 'react';
import { BrandLogo } from './brand-logo';
import { 
  LayoutDashboard, 
  Package, 
  Store, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink 
} from 'lucide-react';

export function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b bg-gradient-to-r from-white via-purple-50 to-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="inline-block group">
          <BrandLogo variant="dark" size="sm" />
        </Link>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 hover:bg-purple-50 rounded-full transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>

        <nav className={`
          ${isMenuOpen ? 'flex' : 'hidden'} 
          lg:flex flex-col lg:flex-row fixed lg:relative 
          top-[61px] lg:top-auto left-0 right-0 
          bg-white lg:bg-transparent border-b lg:border-0 
          p-4 lg:p-0 shadow-lg lg:shadow-none 
          items-start lg:items-center gap-4 
          w-full lg:w-auto z-50
        `}>
          {session ? (
            <>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 w-full lg:w-auto px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/dashboard/products" 
                className="flex items-center gap-2 w-full lg:w-auto px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors"
              >
                <Package className="w-4 h-4" />
                <span>Products</span>
              </Link>
              <Link 
                href={`/shop/${session.user?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full lg:w-auto px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors group"
              >
                <Store className="w-4 h-4" />
                <span>My Shop</span>
                <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
              <div className="flex items-center gap-4 w-full lg:w-auto flex-col lg:flex-row lg:ml-4 lg:border-l lg:pl-4">
                <span className="text-sm font-medium text-gray-600 px-3 py-2">
                  {session.user?.name}
                </span>
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full lg:w-auto gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="w-full lg:w-auto">
                <Button 
                  variant="ghost" 
                  className="w-full lg:w-auto hover:bg-purple-50 hover:text-purple-700"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="w-full lg:w-auto">
                <Button 
                  className="w-full lg:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}