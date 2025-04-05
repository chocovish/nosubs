import Link from 'next/link'
import { BrandLogo } from '@/components/header/brand-logo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="p-6 md:p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-block group">
            <BrandLogo variant="dark" size="lg" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 pb-16">
        {children}
      </main>
    </div>
  )
} 