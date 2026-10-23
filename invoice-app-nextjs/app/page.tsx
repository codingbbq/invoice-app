'use client';

import { useInvoices } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';
import { ProtectRoute } from '@/components/auth/ProtectRoute';
import { ArrowUpRight, DollarSign, FileText, Users, Package } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  // Calculate KPI data
  const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
  
  const kpiData = {
    paidRevenue: totalRevenue,
    totalInvoices: invoices.length,
    totalClients: clients.length,
    newClientsThisMonth: Math.floor(clients.length * 0.1),
    totalProducts: products.length,
  };

  // Create a map of client IDs to client names
  const clientMap: { [key: string]: string } = {};
  clients.forEach((client: any) => {
    clientMap[client.id] = client.client_name || 'Unknown Client';
  });

  // Recent items - sort invoices in descending order by invoice number
  const recentInvoices = invoices
    .sort((a: any, b: any) => {
      const numA = parseInt(String(a.invoiceNumber), 10) || 0;
      const numB = parseInt(String(b.invoiceNumber), 10) || 0;
      return numB - numA;
    })
    .slice(0, 10);
  const recentClients = clients.slice(0, 5);
  
  // Sort products by updatedAt descending (latest first)
  const recentProducts = [...products]
    .sort((a: any, b: any) => {
      let dateA = new Date(0);
      let dateB = new Date(0);
      
      // Try updatedAt first, then createdAt
      const aDate = a.updatedAt || a.createdAt;
      const bDate = b.updatedAt || b.createdAt;
      
      // Handle both ISO strings and Firestore Timestamp objects
      if (aDate) {
        if (typeof aDate === 'string') {
          dateA = new Date(aDate);
        } else if (aDate.toDate) {
          dateA = aDate.toDate();
        } else {
          dateA = new Date(aDate);
        }
      }
      
      if (bDate) {
        if (typeof bDate === 'string') {
          dateB = new Date(bDate);
        } else if (bDate.toDate) {
          dateB = bDate.toDate();
        } else {
          dateB = new Date(bDate);
        }
      }
      
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  // Top performers - Top 5 Clients
  const topClients = clients
    .map((client: any) => ({
      id: client.id,
      name: client.client_name,
      totalRevenue: invoices
        .filter((inv: any) => inv.clientId === client.id)
        .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0),
      invoiceCount: invoices.filter((inv: any) => inv.clientId === client.id).length,
    }))
    .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  // Top 5 Products - calculate based on invoice items
  // totalRevenue = sum of (quantity * rate) for each invoice item
  // Note: rate is the actual price charged per unit in the invoice, which may differ from MRP
  const topProducts = products
    .map((product: any) => {
      const productInvoiceItems = invoices.flatMap((inv: any) => inv.items || [])
        .filter((item: any) => item.productId === product.id);
      
      const unitsSold = productInvoiceItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      const totalRevenue = productInvoiceItems.reduce((sum: number, item: any) => sum + (item.totalCost || 0), 0);
      
      return {
        id: product.id,
        name: product.product_name || product.name || 'Unknown Product',
        totalRevenue: totalRevenue,
        unitsSold: unitsSold,
      };
    })
    .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  const activityFeedData = {
    recentInvoices: recentInvoices.map((inv: any) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      clientId: inv.clientId,
      clientName: clientMap[inv.clientId] || 'Unknown Client',
      invoiceDate: inv.invoiceDate,
      total: inv.total,
    })),
    recentClients: recentClients.map((client: any) => ({
      id: client.id,
      client_name: client.client_name,
      client_email: client.client_email,
      client_phone: client.client_phone,
      totalInvoices: invoices.filter((inv: any) => inv.clientId === client.id).length,
      totalValue: invoices
        .filter((inv: any) => inv.clientId === client.id)
        .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0),
    })),
    recentProducts: recentProducts.map((product: any) => ({
      id: product.id,
      name: product.product_name || product.name || 'Unknown Product',
      mrp: product.product_mrp || product.mrp || 0,
      unitsSold: 0,
      totalRevenue: 0,
    })),
  };

  return (
    <ProtectRoute>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of your business metrics</p>
          </div>

          {/* Stats Grid - Minimalist */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                <DollarSign className="w-4 h-4" />
                Total Revenue
              </div>
              <div className="text-3xl font-semibold text-gray-900">₹{totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-2">{invoices.length} invoices</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                <FileText className="w-4 h-4" />
                Invoices
              </div>
              <div className="text-3xl font-semibold text-gray-900">{invoices.length}</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                <Users className="w-4 h-4" />
                Clients
              </div>
              <div className="text-3xl font-semibold text-gray-900">{clients.length}</div>
              <div className="text-xs text-gray-400 mt-2">Active clients</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                <Package className="w-4 h-4" />
                Products
              </div>
              <div className="text-3xl font-semibold text-gray-900">{products.length}</div>
              <div className="text-xs text-gray-400 mt-2">In catalog</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Invoices */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
                <Link href="/invoices" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                  View all
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                {recentInvoices.slice(0, 5).map((invoice: any) => (
                  <div key={invoice.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Invoice #{invoice.invoiceNumber}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {clientMap[invoice.clientId] || 'Unknown Client'}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{invoice.total?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Clients */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Top Clients</h2>
              </div>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                {topClients.slice(0, 5).map((client: any, index: number) => (
                  <div key={client.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {client.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {client.invoiceCount} invoices
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{client.totalRevenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectRoute>
  );
}
