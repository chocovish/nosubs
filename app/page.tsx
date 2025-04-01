'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BrandHeader } from '@/components/brand-header';
import { FileText, Globe, Monitor } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <BrandHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Welcome to NoSubs
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Your one-stop solution for managing subscriptions and products. Create your store, manage products, and start selling today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <FileText className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Product Management</h3>
              <p>Easily manage your products, update prices, and track inventory all in one place.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <Globe className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Online Store</h3>
              <p>Create your own online store and start selling your products to customers worldwide.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <Monitor className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p>Track your sales, monitor customer behavior, and make data-driven decisions.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
