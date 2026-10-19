'use client';

import { useContext, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from './AuthProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const PUBLIC_ROUTES = ['/login', '/clear-cache'];

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = useMemo(() => PUBLIC_ROUTES.includes(pathname), [pathname]);
  const isAuthenticated = authContext?.isAuthenticated ?? false;

  useEffect(() => {
    // Redirect to login if not authenticated and not on a public route
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
    }
  }, [isAuthenticated, isPublicRoute, router]);

  // If not authenticated and not on public route, show nothing (redirect is happening)
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
