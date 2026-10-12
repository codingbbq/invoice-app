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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Paid Revenue Card */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Paid Revenue</p>
            <p className="text-3xl font-bold text-green-700">₹{(data.paidRevenue / 100000).toFixed(1)}L</p>
            <p className="text-xs text-gray-500 mt-2">Cash collected</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </Card>

      {/* Outstanding Balance Card */}
      <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Outstanding Balance</p>
            <p className="text-3xl font-bold text-red-700">₹{(data.outstandingBalance / 100000).toFixed(1)}L</p>
            <p className="text-xs text-gray-500 mt-2">Unpaid invoices</p>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </Card>

      {/* Invoice Status Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Invoice Status</p>
            <p className="text-3xl font-bold text-blue-700">{data.totalInvoices}</p>
            <div className="text-xs text-gray-500 mt-2 space-y-1">
              <p>📋 Draft: {data.draftInvoices}</p>
              <p>⏳ Pending: {data.pendingInvoices}</p>
              <p>🔴 Overdue: {data.overdueInvoices}</p>
            </div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </Card>

      {/* Clients & Products Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Clients</p>
            <p className="text-2xl font-bold text-purple-700">{data.totalClients}</p>
            <p className="text-xs text-gray-500 mt-1">+{data.newClientsThisMonth} this month</p>
          </div>
          <div className="border-t border-purple-200 pt-3">
            <p className="text-sm font-medium text-gray-600 mb-1">Products/Services</p>
            <p className="text-2xl font-bold text-pink-700">{data.totalProducts}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
