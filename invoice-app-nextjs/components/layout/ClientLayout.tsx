'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InstallBanner } from '@/components/layout/InstallBanner';

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);

  return (
    <Providers>
      {!isLoginPage && <Header />}
      <main className={isLoginPage ? 'min-h-screen' : 'min-h-screen pt-16'}>
        {children}
      </main>
      <Footer />
      <InstallBanner />
    </Providers>
  );
}
