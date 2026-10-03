'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Invoice App
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/clients"
              className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              Clients
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              Products
            </Link>
            <Link
              href="/invoices"
              className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              Invoices
            </Link>
            <Link
              href="/settings"
              className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              Settings
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-6 space-y-2 border-t border-gray-200 pt-4">
            <Link
              href="/"
              className="block px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/clients"
              className="block px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
            >
              Clients
            </Link>
            <Link
              href="/products"
              className="block px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
            >
              Products
            </Link>
            <Link
              href="/invoices"
              className="block px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
            >
              Invoices
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
            >
              Settings
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
