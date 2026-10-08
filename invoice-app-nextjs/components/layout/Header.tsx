'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Invoice App
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-2">
            <Link
              href="/"
              className="px-5 py-2.5 text-slate-700 font-semibold hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/clients"
              className="px-5 py-2.5 text-slate-700 font-semibold hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              Clients
            </Link>
            <Link
              href="/products"
              className="px-5 py-2.5 text-slate-700 font-semibold hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              Products
            </Link>
            <Link
              href="/invoices"
              className="px-5 py-2.5 text-slate-700 font-semibold hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              Invoices
            </Link>
            <Link
              href="/settings"
              className="px-5 py-2.5 text-slate-700 font-semibold hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              Settings
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-700 hover:bg-slate-100 rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-6 space-y-2 border-t border-slate-200 pt-4">
            <Link
              href="/"
              className="block px-5 py-3 text-slate-700 font-semibold hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/clients"
              className="block px-5 py-3 text-slate-700 font-semibold hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200"
            >
              Clients
            </Link>
            <Link
              href="/products"
              className="block px-5 py-3 text-slate-700 font-semibold hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200"
            >
              Products
            </Link>
            <Link
              href="/invoices"
              className="block px-5 py-3 text-slate-700 font-semibold hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200"
            >
              Invoices
            </Link>
            <Link
              href="/settings"
              className="block px-5 py-3 text-slate-700 font-semibold hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200"
            >
              Settings
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
