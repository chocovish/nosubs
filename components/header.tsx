'use client';

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
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { CurrentUserAvatar } from './current-user-avatar';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

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

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/products" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
            <Package className="w-5 h-5" />
            <span>Products</span>
          </Link>
          <Link href="/store" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
            <Store className="w-5 h-5" />
            <span>Store</span>
          </Link>
          <div className="flex items-center space-x-2">
            <CurrentUserAvatar />
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg py-4">
            <div className="container mx-auto px-4 space-y-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/products" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                <Package className="w-5 h-5" />
                <span>Products</span>
              </Link>
              <Link href="/store" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                <Store className="w-5 h-5" />
                <span>Store</span>
              </Link>
              <CurrentUserAvatar />
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:bg-red-50 w-full justify-start"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}