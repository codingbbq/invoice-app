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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome to your invoice management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-8 border-0 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Invoices</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {invoices.length}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-8 border-0 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Clients</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {clients.length}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-8 border-0 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Products</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {products.length}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-8 border-0 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  ₹{totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/invoices/create" className="block">
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                Create Invoice
              </Button>
            </Link>
            <Link href="/clients" className="block">
              <Button className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all">
                View Clients
              </Button>
            </Link>
            <Link href="/products" className="block">
              <Button className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all">
                View Products
              </Button>
            </Link>
            <Link href="/settings" className="block">
              <Button className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all">
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Invoices */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Invoices</h2>
            <Link href="/invoices">
              <Button className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all">
                View All
              </Button>
            </Link>
          </div>

          {recentInvoices.length > 0 ? (
            <Card className="overflow-hidden border-0 shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Invoice #
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentInvoices.map((invoice: any) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          #{invoice.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {invoice.clientId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {invoice.invoiceDate}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                          ₹{invoice.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              invoice.status === 'finalized'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="p-16 text-center border-0 shadow-md">
              <p className="text-gray-600 text-lg mb-6">No invoices yet</p>
              <Link href="/invoices/create">
                <Button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
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
