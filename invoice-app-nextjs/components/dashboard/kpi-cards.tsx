'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Package, FileText } from 'lucide-react';

export interface KPIData {
  paidRevenue: number;
  outstandingBalance: number;
  totalInvoices: number;
  draftInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalClients: number;
  newClientsThisMonth: number;
  totalProducts: number;
}

export function KPICards({ data }: { data: KPIData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {/* Paid Revenue Card */}
      <Card className="p-4 bg-white border border-gray-100 hover:border-gray-200 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Paid Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{(data.paidRevenue / 100000).toFixed(1)}L</p>
            <p className="text-xs text-gray-400 mt-1">Cash collected</p>
          </div>
          <div className="p-2 bg-green-50 rounded-md ml-2 flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </Card>

      {/* Outstanding Balance Card */}
      <Card className="p-4 bg-white border border-gray-100 hover:border-gray-200 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Outstanding</p>
            <p className="text-2xl font-bold text-gray-900">₹{(data.outstandingBalance / 100000).toFixed(1)}L</p>
            <p className="text-xs text-gray-400 mt-1">Unpaid invoices</p>
          </div>
          <div className="p-2 bg-red-50 rounded-md ml-2 flex-shrink-0">
            <FileText className="h-5 w-5 text-red-600" />
          </div>
        </div>
      </Card>

      {/* Invoice Status Card */}
      <Card className="p-4 bg-white border border-gray-100 hover:border-gray-200 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Invoices</p>
            <p className="text-2xl font-bold text-gray-900">{data.totalInvoices}</p>
            <div className="text-xs text-gray-400 mt-1 space-y-0.5">
              <p>Draft: {data.draftInvoices}</p>
              <p>Pending: {data.pendingInvoices}</p>
            </div>
          </div>
          <div className="p-2 bg-blue-50 rounded-md ml-2 flex-shrink-0">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </Card>

      {/* Clients & Products Card */}
      <Card className="p-4 bg-white border border-gray-100 hover:border-gray-200 transition-colors">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Clients</p>
            <p className="text-2xl font-bold text-gray-900">{data.totalClients}</p>
            <p className="text-xs text-gray-400 mt-1">+{data.newClientsThisMonth} new</p>
          </div>
          <div className="border-t border-gray-100 pt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Products</p>
            <p className="text-xl font-bold text-gray-900">{data.totalProducts}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
