'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface TopClient {
  id: string;
  name: string;
  totalRevenue: number;
  invoiceCount: number;
}

export interface TopProduct {
  id: string;
  name: string;
  totalRevenue: number;
  unitsSold: number;
}

export interface TopPerformersData {
  topClients: TopClient[];
  topProducts: TopProduct[];
}

export function TopPerformers({ data }: { data: TopPerformersData }) {
  const [expandedClients, setExpandedClients] = useState(true);
  const [expandedProducts, setExpandedProducts] = useState(true);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Clients */}
      <Card className="p-6">
        <div
          className="flex items-center justify-between cursor-pointer mb-4"
          onClick={() => setExpandedClients(!expandedClients)}
        >
          <h3 className="text-lg font-semibold text-gray-900">Top 3 Clients by Revenue</h3>
          {expandedClients ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {expandedClients && (
          <div className="space-y-3">
            {data.topClients.length > 0 ? (
              data.topClients.map((client, index) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.invoiceCount} invoices</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-semibold text-gray-900">₹{(client.totalRevenue / 100000).toFixed(1)}L</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">No client data available</p>
            )}
          </div>
        )}
      </Card>

      {/* Top Products */}
      <Card className="p-6">
        <div
          className="flex items-center justify-between cursor-pointer mb-4"
          onClick={() => setExpandedProducts(!expandedProducts)}
        >
          <h3 className="text-lg font-semibold text-gray-900">Top 5 Best-Selling Products</h3>
          {expandedProducts ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {expandedProducts && (
          <div className="space-y-3">
            {data.topProducts.length > 0 ? (
              data.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.unitsSold} units sold</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-semibold text-gray-900">₹{(product.totalRevenue / 100000).toFixed(1)}L</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">No product data available</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
