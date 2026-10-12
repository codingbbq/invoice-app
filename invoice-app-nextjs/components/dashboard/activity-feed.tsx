'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';

export interface Invoice {
  id: string;
  invoiceNumber: number;
  clientId: string;
  invoiceDate: string;
  total: number;
  status: 'draft' | 'finalized';
}

export interface Client {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  totalInvoices?: number;
  totalValue?: number;
}

export interface Product {
  id: string;
  name: string;
  mrp: number;
  unitsSold?: number;
  totalRevenue?: number;
}

export interface ActivityFeedData {
  recentInvoices: Invoice[];
  recentClients: Client[];
  recentProducts: Product[];
}

export function ActivityFeed({ data }: { data: ActivityFeedData }) {
  const [activeTab, setActiveTab] = useState<'invoices' | 'clients' | 'products'>('invoices');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finalized':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'invoices'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Invoices
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'clients'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Clients
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Products
        </button>
      </div>

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-3">
          {data.recentInvoices.length > 0 ? (
            data.recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    #{invoice.invoiceNumber} - {invoice.clientId}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {invoice.invoiceDate} • ₹{invoice.total.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(invoice.status)}`}>
                    {getStatusLabel(invoice.status)}
                  </span>
                  <Link href={`/invoices/${invoice.id}`}>
                    <Button variant="ghost" size="sm" className="p-1">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No invoices yet</p>
          )}
        </div>
      )}

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div className="space-y-3">
          {data.recentClients.length > 0 ? (
            data.recentClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{client.client_name}</p>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {client.client_email} • {client.client_phone}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {client.totalInvoices || 0} invoices • ₹{((client.totalValue || 0) / 100000).toFixed(1)}L lifetime
                  </p>
                </div>
                <Link href={`/clients/${client.id}/edit`}>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No clients yet</p>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-3">
          {data.recentProducts.length > 0 ? (
            data.recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    ₹{product.mrp.toLocaleString()} • {product.unitsSold || 0} units sold
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Revenue: ₹{((product.totalRevenue || 0) / 100000).toFixed(1)}L
                  </p>
                </div>
                <Link href={`/products/${product.id}/edit`}>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No products yet</p>
          )}
        </div>
      )}
    </Card>
  );
}
