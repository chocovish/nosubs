'use client';

import { QueryProvider } from '@/lib/providers';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}