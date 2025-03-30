import Link from 'next/link';
import { BrandLogo } from './brand-logo';

export function BrandHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 p-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-block group">
          <BrandLogo variant="light" size="lg" />
        </Link>
      </div>
    </header>
  );
} 