'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Invoice App</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Professional invoice management system built with Next.js, React, and Firestore for modern businesses.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/clients" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 font-medium">
                  → Clients
                </a>
              </li>
              <li>
                <a href="/products" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 font-medium">
                  → Products
                </a>
              </li>
              <li>
                <a href="/invoices" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 font-medium">
                  → Invoices
                </a>
              </li>
              <li>
                <a href="/settings" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 font-medium">
                  → Settings
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 font-medium">
                  → Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 font-medium">
                  → Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 font-medium">
                  → FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <p className="text-center text-sm text-slate-500 font-medium">
            &copy; {currentYear} Invoice Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
