'use client';

import { useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from './AuthProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const PUBLIC_ROUTES = ['/login', '/clear-cache'];

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isLoading = authContext?.isLoading ?? true;
  const isAuthenticated = authContext?.isAuthenticated ?? false;

  useEffect(() => {
    // Once loading is done, check if we need to redirect
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, isPublicRoute, router]);

  // Show nothing while loading (AuthProvider will handle redirect)
  if (isLoading) {
    return null;
  }

  // If not authenticated and not on public route, don't render (redirect is happening)
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  // Render layout with children
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
