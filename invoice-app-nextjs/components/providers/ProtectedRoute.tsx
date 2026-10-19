'use client';

import { useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from './AuthProvider';
import { Card } from '@/components/ui/card';

const PUBLIC_ROUTES = ['/login', '/clear-cache'];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isLoading = authContext?.isLoading ?? true;
  const isAuthenticated = authContext?.isAuthenticated ?? false;

  useEffect(() => {
    // Wait for auth check to complete
    if (!isLoading) {
      // If not authenticated and not on a public route, redirect to login
      if (!isAuthenticated && !isPublicRoute) {
        router.push('/login');
      } else {
        setIsReady(true);
      }
    }
  }, [isLoading, isAuthenticated, isPublicRoute, router]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600">Checking authentication...</p>
        </Card>
      </div>
    );
  }

  // If not authenticated and not on public route, don't render anything (redirect is happening)
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  // Render children if authenticated or on public route
  return <>{children}</>;
}
