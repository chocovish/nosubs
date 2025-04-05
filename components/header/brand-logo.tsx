import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  weight: '700'
});

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'lg';
}

export function BrandLogo({ variant = 'light', size = 'lg' }: BrandLogoProps) {
  const gradientClasses = {
    light: 'from-white via-yellow-200 to-white hover:from-yellow-300 hover:via-white hover:to-yellow-300',
    dark: 'from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:via-pink-600 hover:to-purple-700'
  };

  const sizeClasses = {
    sm: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl'
  };

  return (
    <h1 className={`font-bold bg-gradient-to-r ${gradientClasses[variant]} ${sizeClasses[size]} bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 ${dancingScript.className}`}>
      SellFiles.me
    </h1>
  );
} 