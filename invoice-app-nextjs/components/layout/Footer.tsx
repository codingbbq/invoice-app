'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Invoice App</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Invoice management system for modern businesses.
            </p>
          </div>
         
        </div>

        <div className="border-t border-slate-800 pt-8">
          <p className="text-center text-sm text-slate-500 font-medium">
            &copy; {currentYear} Invoice App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
