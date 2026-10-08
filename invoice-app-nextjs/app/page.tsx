'use client';

import { useInvoices } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Users, Package, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-lg text-slate-500 font-medium">Overview of your invoice management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Total Invoices</p>
                <p className="text-5xl font-bold text-slate-900 mb-2">
                  {invoices.length}
                </p>
                <p className="text-sm text-slate-400">All invoices created</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl ml-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Total Clients</p>
                <p className="text-5xl font-bold text-slate-900 mb-2">
                  {clients.length}
                </p>
                <p className="text-sm text-slate-400">Active clients</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl ml-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Total Products</p>
                <p className="text-5xl font-bold text-slate-900 mb-2">
                  {products.length}
                </p>
                <p className="text-sm text-slate-400">Product catalog</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl ml-4">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Total Revenue</p>
                <p className="text-5xl font-bold text-slate-900 mb-2">
                  ₹{totalRevenue.toFixed(2)}
                </p>
                <p className="text-sm text-slate-400">All-time revenue</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-2xl ml-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/invoices/create" className="block group">
              <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base">
                + Create Invoice
              </Button>
            </Link>
            <Link href="/clients" className="block group">
              <Button className="w-full h-14 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-slate-300 hover:bg-slate-50 hover:shadow-md transition-all duration-300 text-base">
                View Clients
              </Button>
            </Link>
            <Link href="/products" className="block group">
              <Button className="w-full h-14 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-slate-300 hover:bg-slate-50 hover:shadow-md transition-all duration-300 text-base">
                View Products
              </Button>
            </Link>
            <Link href="/settings" className="block group">
              <Button className="w-full h-14 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-slate-300 hover:bg-slate-50 hover:shadow-md transition-all duration-300 text-base">
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Invoices */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Recent Invoices</h2>
            <Link href="/invoices">
              <Button className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-slate-300 hover:bg-slate-50 hover:shadow-md transition-all duration-300">
                View All →
              </Button>
            </Link>
          </div>

          {recentInvoices.length > 0 ? (
            <Card className="overflow-hidden border-0 shadow-lg rounded-2xl bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-8 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-8 py-5 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recentInvoices.map((invoice: any) => (
                      <tr key={invoice.id} className="hover:bg-slate-50 transition-colors duration-200">
                        <td className="px-8 py-5 text-sm font-bold text-slate-900">
                          #{invoice.invoiceNumber}
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                          {invoice.clientId}
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                          {invoice.invoiceDate}
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-900 text-right">
                          ₹{invoice.total.toFixed(2)}
                        </td>
                        <td className="px-8 py-5 text-sm">
                          <span
                            className={`px-4 py-2 rounded-full text-xs font-bold inline-block ${
                              invoice.status === 'finalized'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {invoice.status === 'finalized' ? '✓ Finalized' : '⏳ Draft'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="p-20 text-center border-0 shadow-lg rounded-2xl bg-white">
              <div className="mb-6">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              </div>
              <p className="text-slate-600 text-lg font-medium mb-8">No invoices created yet</p>
              <Link href="/invoices/create">
                <Button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base">
                  Create Your First Invoice
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
