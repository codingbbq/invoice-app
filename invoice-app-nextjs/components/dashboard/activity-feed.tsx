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
  clientName?: string;
  invoiceDate: string;
  total: number;
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

  return (
    <Card className="p-4 mb-6 border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>

      {/* Tab Switcher */}
      <div className="flex gap-4 mb-3 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-0 py-2 font-medium text-xs border-b-2 transition-colors ${
            activeTab === 'invoices'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Invoices
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-0 py-2 font-medium text-xs border-b-2 transition-colors ${
            activeTab === 'clients'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Clients
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-0 py-2 font-medium text-xs border-b-2 transition-colors ${
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
        <div className="space-y-2">
          {data.recentInvoices.length > 0 ? (
            <div className="hidden md:block">
              <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 rounded-md mb-2">
                <div className="col-span-2">Invoice #</div>
                <div className="col-span-3">Client</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-3 text-right">Amount</div>
                <div className="col-span-2 text-right">Action</div>
              </div>
              {data.recentInvoices.map((invoice) => (
                <div key={invoice.id} className="grid grid-cols-12 gap-3 px-3 py-2.5 items-center hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-100">
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-900 text-sm">#{invoice.invoiceNumber}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-600 truncate">{invoice.clientName || invoice.clientId}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">{invoice.invoiceDate}</p>
                  </div>
                  <div className="col-span-3 text-right">
                    <p className="font-semibold text-gray-900 text-sm">₹{(invoice.total || 0).toFixed(2)}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <Link href={`/invoices/${invoice.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4 text-sm">No invoices yet</p>
          )}
          {data.recentInvoices.length > 0 && (
            <div className="md:hidden space-y-2">
              {data.recentInvoices.map((invoice) => (
                <div key={invoice.id} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-gray-900 text-sm">#{invoice.invoiceNumber}</p>
                    <Link href={`/invoices/${invoice.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    </Link>
                  </div>
                  <p className="text-xs text-gray-600">{invoice.clientName || invoice.clientId}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">{invoice.invoiceDate}</p>
                    <p className="font-semibold text-gray-900 text-sm">₹{(invoice.total || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div className="space-y-2">
          {data.recentClients.length > 0 ? (
            <div className="hidden md:block">
              <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 rounded-md mb-2">
                <div className="col-span-3">Name</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Phone</div>
                <div className="col-span-2 text-right">Invoices</div>
                <div className="col-span-2 text-right">Lifetime Value</div>
              </div>
              {data.recentClients.map((client) => (
                <div key={client.id} className="grid grid-cols-12 gap-3 px-3 py-2.5 items-center hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-100">
                  <div className="col-span-3">
                    <p className="font-semibold text-gray-900 text-sm truncate">{client.client_name}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-600 truncate">{client.client_email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">{client.client_phone}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-sm text-gray-900 font-medium">{client.totalInvoices || 0}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="font-semibold text-gray-900 text-sm">₹{((client.totalValue || 0) / 100000).toFixed(1)}L</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4 text-sm">No clients yet</p>
          )}
          {data.recentClients.length > 0 && (
            <div className="md:hidden space-y-2">
              {data.recentClients.map((client) => (
                <div key={client.id} className="p-3 bg-gray-50 rounded-md">
                  <p className="font-semibold text-gray-900 text-sm">{client.client_name}</p>
                  <p className="text-xs text-gray-600 mt-1">{client.client_email}</p>
                  <p className="text-xs text-gray-600">{client.client_phone}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">{client.totalInvoices || 0} invoices</p>
                    <p className="font-semibold text-gray-900 text-sm">₹{((client.totalValue || 0) / 100000).toFixed(1)}L</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-2">
          {data.recentProducts.length > 0 ? (
            <div className="hidden md:block">
              <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 rounded-md mb-2">
                <div className="col-span-4">Product Name</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Units Sold</div>
                <div className="col-span-4 text-right">Revenue</div>
              </div>
              {data.recentProducts.map((product) => (
                <div key={product.id} className="grid grid-cols-12 gap-3 px-3 py-2.5 items-center hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-100">
                  <div className="col-span-4">
                    <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-sm text-gray-600">₹{(product.mrp || 0).toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-sm text-gray-900 font-medium">{product.unitsSold || 0}</p>
                  </div>
                  <div className="col-span-4 text-right">
                    <p className="font-semibold text-gray-900 text-sm">₹{((product.totalRevenue || 0) / 100000).toFixed(1)}L</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4 text-sm">No products yet</p>
          )}
          {data.recentProducts.length > 0 && (
            <div className="md:hidden space-y-2">
              {data.recentProducts.map((product) => (
                <div key={product.id} className="p-3 bg-gray-50 rounded-md">
                  <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-600">₹{(product.mrp || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-600">{product.unitsSold || 0} units</p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mt-2">₹{((product.totalRevenue || 0) / 100000).toFixed(1)}L</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
