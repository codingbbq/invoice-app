'use client';

import { useInvoices } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';
import { ProtectRoute } from '@/components/auth/ProtectRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FileText, Users, Package, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  // Calculate KPI data
  const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
  const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid').length;
  const pendingInvoices = invoices.filter((inv: any) => inv.status === 'pending').length;
  
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
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Link href="/invoices/create">
              <Button>Create Invoice</Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From {invoices.length} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices.length}</div>
              <p className="text-xs text-muted-foreground">
                {paidInvoices} paid, {pendingInvoices} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">
                Active clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                In catalog
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>
                Your latest invoice activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {recentInvoices.slice(0, 5).map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center">
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">
                        Invoice #{invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {clientMap[invoice.clientId] || 'Unknown Client'}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      ₹{invoice.total?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/invoices">
                  <Button variant="outline" className="w-full">
                    View All Invoices
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Link href="/invoices/create">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  New Invoice
                </Button>
              </Link>
              <Link href="/clients/add">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </Link>
              <Link href="/products/add">
                <Button className="w-full justify-start" variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Clients</CardTitle>
              <CardDescription>
                By total revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {topClients.slice(0, 5).map((client: any, index: number) => (
                  <div key={client.id} className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{client.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {client.invoiceCount} invoices
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      ₹{client.totalRevenue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>
                By revenue generated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {topProducts.slice(0, 5).map((product: any, index: number) => (
                  <div key={product.id} className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.unitsSold} units sold
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      ₹{product.totalRevenue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectRoute>
  );
}
