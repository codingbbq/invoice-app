'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
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
            {user && (
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <p className="px-5 py-2 text-sm text-gray-600">Welcome, <strong>{user.email}</strong></p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
