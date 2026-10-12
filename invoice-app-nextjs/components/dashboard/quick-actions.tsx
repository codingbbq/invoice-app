'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Link href="/invoices/create" className="w-full">
          <Button variant="primary" className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Invoice</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>

        <Link href="/clients/add" className="w-full">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Client</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>

        <Link href="/products/add" className="w-full">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>

        <Link href="/invoices" className="w-full">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium">
            <FileText className="h-4 w-4" />
            <span>View All</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
