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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Top Clients */}
      <Card className="p-4 border border-gray-100">
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => setExpandedClients(!expandedClients)}
        >
          <h3 className="text-sm font-semibold text-gray-900">Top 3 Clients</h3>
          {expandedClients ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>

        {expandedClients && (
          <div className="space-y-2">
            {data.topClients.length > 0 ? (
              data.topClients.map((client, index) => (
                <div key={client.id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-md transition-colors">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.invoiceCount} invoices</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-semibold text-gray-900 text-sm">₹{(client.totalRevenue / 100000).toFixed(1)}L</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-3 text-xs">No data</p>
            )}
          </div>
        )}
      </Card>

      {/* Top Products */}
      <Card className="p-4 border border-gray-100">
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => setExpandedProducts(!expandedProducts)}
        >
          <h3 className="text-sm font-semibold text-gray-900">Top 5 Products</h3>
          {expandedProducts ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>

        {expandedProducts && (
          <div className="space-y-2">
            {data.topProducts.length > 0 ? (
              data.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-md transition-colors">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-semibold text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.unitsSold} units</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-semibold text-gray-900 text-sm">₹{(product.totalRevenue / 100000).toFixed(1)}L</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-3 text-xs">No data</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
