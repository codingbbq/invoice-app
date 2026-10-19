import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { ProtectedRoute } from '@/components/providers/ProtectedRoute';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Invoice Management System',
  description: 'Modern invoice management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Providers>
          <ProtectedRoute>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ProtectedRoute>
        </Providers>
      </body>
    </html>
  );
}
