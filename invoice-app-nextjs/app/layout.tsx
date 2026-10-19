import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { LayoutContent } from '@/components/providers/LayoutContent';
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
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
