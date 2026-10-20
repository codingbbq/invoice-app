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

          {isAuthenticated ? (
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
                    <span className="text-sm text-gray-600">Welcome, <strong>{user.email}</strong></span>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="flex items-center gap-2 text-slate-700 hover:bg-red-50 hover:text-red-600"
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
