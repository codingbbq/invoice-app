'use client';

import { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </Providers>
  );
}
