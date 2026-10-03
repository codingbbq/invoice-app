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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your invoice management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {invoices.length}
              </p>
            </div>
            <FileText className="h-12 w-12 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {clients.length}
              </p>
            </div>
            <Users className="h-12 w-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {products.length}
              </p>
            </div>
            <Package className="h-12 w-12 text-purple-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ₹{totalRevenue.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-orange-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/invoices/create">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Create Invoice
            </Button>
          </Link>
          <Link href="/clients">
            <Button variant="outline" className="w-full">
              View Clients
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full">
              View Products
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" className="w-full">
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Invoices */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Invoices</h2>
          <Link href="/invoices">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {recentInvoices.length > 0 ? (
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentInvoices.map((invoice: any) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {invoice.clientId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {invoice.invoiceDate}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      ₹{invoice.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No invoices yet</p>
            <Link href="/invoices/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Your First Invoice
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
