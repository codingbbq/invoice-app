'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

export default function ClearCachePage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all localStorage items
    localStorage.clear();
    sessionStorage.clear();
    
    // Show success message
    const timer = setTimeout(() => {
      router.push('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Clearing Cache...</h1>
        <p className="text-gray-600 mb-4">Clearing all cached data and redirecting to login page.</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">You will be redirected in a moment...</p>
      </Card>
    </div>
  );
}
