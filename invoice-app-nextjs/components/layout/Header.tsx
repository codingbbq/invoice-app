'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, LayoutDashboard, Users, Package, FileText, Settings } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  const isAuthenticated = !!user;

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const navLinkClass = (href: string) => {
    const baseClass = 'px-3 py-2 text-sm font-medium transition-colors';
    const activeClass = 'text-gray-900';
    const inactiveClass = 'text-gray-500 hover:text-gray-900';
    return `${baseClass} ${isActive(href) ? activeClass : inactiveClass}`;
  };

  const mobileNavLinkClass = (href: string) => {
    const baseClass = 'block px-4 py-2 text-sm font-medium transition-colors';
    const activeClass = 'text-gray-900 bg-gray-50';
    const inactiveClass = 'text-gray-500 hover:text-gray-900 hover:bg-gray-50';
    return `${baseClass} ${isActive(href) ? activeClass : inactiveClass}`;
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Invoice App
            </Link>
          </div>

          {isAuthenticated && (
            <>
              <nav className="hidden md:flex items-center space-x-1">
                <Link href="/" className={`${navLinkClass('/')} flex items-center gap-2`}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/clients" className={`${navLinkClass('/clients')} flex items-center gap-2`}>
                  <Users className="w-4 h-4" />
                  Clients
                </Link>
                <Link href="/products" className={`${navLinkClass('/products')} flex items-center gap-2`}>
                  <Package className="w-4 h-4" />
                  Products
                </Link>
                <Link href="/invoices" className={`${navLinkClass('/invoices')} flex items-center gap-2`}>
                  <FileText className="w-4 h-4" />
                  Invoices
                </Link>
                <Link href="/settings" className={`${navLinkClass('/settings')} flex items-center gap-2`}>
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                {user && (
                  <>
                    <span className="text-sm text-gray-500">{user.email}</span>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-700 hover:bg-slate-100 rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <Link href="/" className={`${mobileNavLinkClass('/')} flex items-center gap-2`} onClick={() => setMobileMenuOpen(false)}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/clients" className={`${mobileNavLinkClass('/clients')} flex items-center gap-2`} onClick={() => setMobileMenuOpen(false)}>
                <Users className="w-4 h-4" />
                Clients
              </Link>
              <Link href="/products" className={`${mobileNavLinkClass('/products')} flex items-center gap-2`} onClick={() => setMobileMenuOpen(false)}>
                <Package className="w-4 h-4" />
                Products
              </Link>
              <Link href="/invoices" className={`${mobileNavLinkClass('/invoices')} flex items-center gap-2`} onClick={() => setMobileMenuOpen(false)}>
                <FileText className="w-4 h-4" />
                Invoices
              </Link>
              <Link href="/settings" className={`${mobileNavLinkClass('/settings')} flex items-center gap-2`} onClick={() => setMobileMenuOpen(false)}>
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              {user && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <p className="px-4 py-2 text-sm text-gray-500">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
