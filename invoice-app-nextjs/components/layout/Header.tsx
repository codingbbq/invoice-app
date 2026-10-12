'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const navLinkClass = (href: string) => {
    const baseClass = 'px-5 py-2.5 font-semibold rounded-xl transition-all duration-200';
    const activeClass = 'bg-blue-600 text-white';
    const inactiveClass = 'text-slate-700 hover:text-blue-600 hover:bg-blue-50';
    return `${baseClass} ${isActive(href) ? activeClass : inactiveClass}`;
  };

  const mobileNavLinkClass = (href: string) => {
    const baseClass = 'block px-5 py-3 font-semibold rounded-xl transition-all duration-200';
    const activeClass = 'bg-blue-600 text-white';
    const inactiveClass = 'text-slate-700 hover:bg-blue-50 hover:text-blue-600';
    return `${baseClass} ${isActive(href) ? activeClass : inactiveClass}`;
  };

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
            <Link href="/" className={navLinkClass('/')}>
              Dashboard
            </Link>
            <Link href="/clients" className={navLinkClass('/clients')}>
              Clients
            </Link>
            <Link href="/products" className={navLinkClass('/products')}>
              Products
            </Link>
            <Link href="/invoices" className={navLinkClass('/invoices')}>
              Invoices
            </Link>
            <Link href="/settings" className={navLinkClass('/settings')}>
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
            <Link href="/" className={mobileNavLinkClass('/')}>
              Dashboard
            </Link>
            <Link href="/clients" className={mobileNavLinkClass('/clients')}>
              Clients
            </Link>
            <Link href="/products" className={mobileNavLinkClass('/products')}>
              Products
            </Link>
            <Link href="/invoices" className={mobileNavLinkClass('/invoices')}>
              Invoices
            </Link>
            <Link href="/settings" className={mobileNavLinkClass('/settings')}>
              Settings
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
