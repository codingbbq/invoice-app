'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, Package } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/invoices/create" className="w-full">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-6">
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">New Invoice</span>
            <span className="sm:hidden">Invoice</span>
          </Button>
        </Link>

        <Link href="/clients/add" className="w-full">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-6">
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Add Client</span>
            <span className="sm:hidden">Client</span>
          </Button>
        </Link>

        <Link href="/products/add" className="w-full">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-6">
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Product</span>
          </Button>
        </Link>

        <Link href="/invoices" className="w-full">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-6">
            <FileText className="h-5 w-5" />
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden">All</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
