'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './AuthProvider';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
