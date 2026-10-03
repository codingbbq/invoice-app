'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useInvoices, useDeleteInvoice } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Eye, Plus, Download } from 'lucide-react';

export default function InvoicesPage() {
  const { data: invoices = [], isLoading } = useInvoices();
  const deleteInvoice = useDeleteInvoice();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteInvoice.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete invoice:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-2">Manage and create invoices</p>
        </div>
        <Link href="/invoices/create">
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading invoices...</p>
        </Card>
      ) : invoices.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">No invoices found</p>
          <Link href="/invoices/create">
            <Button className="bg-blue-600 hover:bg-blue-700">Create Your First Invoice</Button>
          </Link>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
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
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map((invoice: any) => (
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
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Link href={`/invoices/${invoice.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        {deleteConfirm === invoice.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(invoice.id)}
                              disabled={deleteInvoice.isPending}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 flex items-center gap-1"
                            onClick={() => setDeleteConfirm(invoice.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
