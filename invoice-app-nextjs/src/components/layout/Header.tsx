'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Invoice App
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/clients"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Clients
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Products
            </Link>
            <Link
              href="/invoices"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Invoices
            </Link>
            <Link
              href="/settings"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Settings
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Dashboard
            </Link>
            <Link
              href="/clients"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Clients
            </Link>
            <Link
              href="/products"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Products
            </Link>
            <Link
              href="/invoices"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Invoices
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Settings
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
