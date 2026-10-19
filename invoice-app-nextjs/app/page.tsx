'use client';

import { useInvoices } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { TopPerformers } from '@/components/dashboard/top-performers';
import { Card } from '@/components/ui/card';

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
  const recentProducts = products.slice(0, 5);

  // Top performers
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
    .slice(0, 3);

  const topProducts = products
    .map((product: any) => ({
      id: product.id,
      name: product.name,
      totalRevenue: 0,
      unitsSold: 0,
    }))
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
      name: product.name,
      mrp: product.mrp,
      unitsSold: 0,
      totalRevenue: 0,
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">Financial overview and quick insights</p>
        </div>

        {/* KPI Cards */}
        <KPICards data={kpiData} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Activity Feed */}
        <ActivityFeed data={activityFeedData} />

        {/* Top Performers */}
        <TopPerformers data={{ topClients, topProducts }} />
      </div>
    </div>
  );
}
