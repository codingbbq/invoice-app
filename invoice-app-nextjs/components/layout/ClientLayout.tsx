'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <Providers>
      {!isLoginPage && <Header />}
      <main className={isLoginPage ? 'min-h-screen' : 'min-h-screen pt-16'}>
        {children}
      </main>
      <Footer />
    </Providers>
  );
}
