'use client';

import { useState, useMemo } from 'react';
import { ProtectRoute } from '@/components/auth/ProtectRoute';
import Link from 'next/link';
import { useInvoices, useDeleteInvoice } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/hooks/useSearch';
import { useSort } from '@/hooks/useSort';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { SortableHeader } from '@/components/ui/sortable-header';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PageHeader } from '@/components/ui/page-header';
import { Trash2, Eye, Plus, Download, Hash, User, Calendar, DollarSign, AlertCircle } from 'lucide-react';

export default function InvoicesPage() {
  const { data: invoices = [], isLoading } = useInvoices();
  const { data: clients = [] } = useClients();
  const deleteInvoice = useDeleteInvoice();
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; number: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create a map of client IDs to client names for quick lookup
  const clientMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    clients.forEach((client: any) => {
      map[client.id] = client.client_name || 'Unknown Client';
    });
    return map;
  }, [clients]);
  
  // Custom search that includes client names
  const [searchQuery, setSearchQuery] = useState('');
  const searchedInvoices = useMemo(() => {
    if (!searchQuery.trim()) {
      return invoices;
    }

    const query = searchQuery.toLowerCase();
    return invoices.filter((invoice: any) => {
      const invoiceNumberMatch = String(invoice.invoiceNumber).toLowerCase().includes(query);
      const clientNameMatch = (clientMap[invoice.clientId] || '').toLowerCase().includes(query);
      const dateMatch = (invoice.invoiceDate || '').toLowerCase().includes(query);
      
      return invoiceNumberMatch || clientNameMatch || dateMatch;
    });
  }, [invoices, searchQuery, clientMap]);

  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const { items: sortedInvoices, sortConfig, toggleSort } = useSort(searchedInvoices, {
    key: 'invoiceNumber' as any,
    direction: 'desc',
  });
  
  const { items: paginatedInvoices, pagination, goToPage, setPageSize } = usePagination(sortedInvoices, 10);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteInvoice.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete invoice:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectRoute>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Invoices</h1>
              <p className="text-sm text-gray-500">Manage and create invoices</p>
            </div>
            <Link href="/invoices/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </Link>
          </div>

      {invoices.length > 0 && (
        <div className="mb-8">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={clearSearch}
            placeholder="Search by invoice number, client name, date, or status..."
            resultCount={searchedInvoices.length}
            totalCount={invoices.length}
          />
        </div>
      )}

      {isLoading ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading invoices...</p>
        </Card>
      ) : invoices.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">No invoices found</p>
          <Link href="/invoices/create">
            <Button variant="primary">Create Your First Invoice</Button>
          </Link>
        </Card>
      ) : (
        <div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <SortableHeader
                        label="Invoice #"
                        sortKey="invoiceNumber"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('invoiceNumber' as any)}
                        icon={Hash}
                      />
                    </th>
                    <th className="px-6 py-4 text-left">
                      <SortableHeader
                        label="Client"
                        sortKey="clientId"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('clientId' as any)}
                        icon={User}
                      />
                    </th>
                    <th className="px-6 py-4 text-left">
                      <SortableHeader
                        label="Date"
                        sortKey="invoiceDate"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('invoiceDate' as any)}
                        icon={Calendar}
                      />
                    </th>
                    <th className="px-6 py-4 text-right">
                      <SortableHeader
                        label="Amount"
                        sortKey="total"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('total' as any)}
                        icon={DollarSign}
                      />
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedInvoices.map((invoice: any) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {clientMap[invoice.clientId] || invoice.clientId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {invoice.invoiceDate}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        ₹{invoice.total.toFixed(2)}
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 flex items-center gap-1"
                            onClick={() => setDeleteConfirm({ id: invoice.id, number: invoice.invoiceNumber })}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={goToPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}
      
          <ConfirmDialog
            isOpen={!!deleteConfirm}
            title="Delete Invoice"
            description={`Are you sure you want to delete invoice "${deleteConfirm?.number}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isDeleting}
            isDangerous={true}
            onConfirm={handleDelete}
            onCancel={() => setDeleteConfirm(null)}
          />
        </div>
      </div>
    </ProtectRoute>
  );
}
