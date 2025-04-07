import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BrandHeader } from '@/components/header/brand-header';
import { FileText, Globe, Monitor } from 'lucide-react';
import { auth } from '@/lib/auth';

export default async function Home() {
  const user = await auth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <BrandHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-36 gap-8">
          <div className="flex-1 text-white space-y-4 md:space-y-6 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Sell Digital Goods
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent mt-2">
                Without Commission
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-xl mx-auto md:mx-0">
              Your creativity, your earnings - keep 100% of what you make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              {user?.id
              ? (<Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="bg-white text-purple-600 hover:bg-white/90 text-lg px-8 py-6 w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>)
              : (<><Link href="/signup" className="w-full sm:w-auto">
                  <Button className="bg-white text-purple-600 hover:bg-white/90 text-lg px-8 py-6 w-full sm:w-auto">
                    Start Selling
                  </Button>
                </Link><Link href="/login" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white text-white hover:bg-white/20 text-lg px-8 py-6 w-full sm:w-auto"
                    >
                      Sign In
                    </Button>
                  </Link></>)}
            </div>
          </div>
          <div className="flex-1 h-[250px] sm:h-[300px] md:h-[400px] w-full max-w-[500px] mx-auto relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-float h-full">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 sm:p-4 transform hover:scale-105 transition-transform">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-2 sm:mb-3" />
                <h3 className="text-white font-semibold text-sm sm:text-base">Digital Files</h3>
                <p className="text-white/70 text-xs sm:text-sm">PDFs, Templates, Assets</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 sm:p-4 transform hover:scale-105 transition-transform mt-8">
                <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-2 sm:mb-3" />
                <h3 className="text-white font-semibold text-sm sm:text-base">Global Reach</h3>
                <p className="text-white/70 text-xs sm:text-sm">Sell Worldwide</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 sm:p-4 transform hover:scale-105 transition-transform">
                <Monitor className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-2 sm:mb-3" />
                <h3 className="text-white font-semibold text-sm sm:text-base">Easy Platform</h3>
                <p className="text-white/70 text-xs sm:text-sm">Simple to Use</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 md:py-16 mt-8">
          <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Zero Commission</h2>
            <p className="text-white/70 text-sm sm:text-base">Keep 100% of your sales. No hidden fees.</p>
          </div>
          <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Instant Payouts</h2>
            <p className="text-white/70 text-sm sm:text-base">Get paid immediately after each sale.</p>
          </div>
          <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Secure Platform</h2>
            <p className="text-white/70 text-sm sm:text-base">Your content is safe with us.</p>
          </div>
        </div>
        
        {/* Footer Links */}
        <footer className="mt-auto py-6 text-center">
          <div className="flex justify-center items-center gap-4 text-white/80 text-sm">
            <Link href="/terms" className="hover:text-white hover:underline transition">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white hover:underline transition">
              Privacy Policy
            </Link>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}