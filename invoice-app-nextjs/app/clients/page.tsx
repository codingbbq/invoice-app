'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useClients, useDeleteClient } from '@/hooks/useClients';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/hooks/useSearch';
import { useSort } from '@/hooks/useSort';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { SortableHeader } from '@/components/ui/sortable-header';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Trash2, Edit, Plus } from 'lucide-react';
import { ProtectRoute } from '@/components/auth/ProtectRoute';

export default function ClientsPage() {
  const { data: clients = [], isLoading } = useClients();
  const deleteClient = useDeleteClient();
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { items: searchedClients, searchQuery, setSearchQuery, clearSearch } = useSearch({
    data: clients,
    searchFields: ['client_name', 'client_email', 'client_phone', 'client_gst_no', 'client_address'] as const,
  });
  
  const { items: sortedClients, sortConfig, toggleSort } = useSort(searchedClients);
  
  const { items: paginatedClients, pagination, goToPage, setPageSize } = usePagination(sortedClients, 10);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteClient.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete client:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2">Manage your clients and their information</p>
        </div>
        <Link href="/clients/add">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      {clients.length > 0 && (
        <div className="mb-8">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={clearSearch}
            placeholder="Search by name, email, phone, GST number, or address..."
            resultCount={searchedClients.length}
            totalCount={clients.length}
          />
        </div>
      )}

      {isLoading ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading clients...</p>
        </Card>
      ) : clients.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">No clients found</p>
          <Link href="/clients/add">
            <Button variant="primary">Add Your First Client</Button>
          </Link>
        </Card>
      ) : (
        <div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm">
                      <SortableHeader
                        label="Name"
                        sortKey="client_name"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('client_name' as any)}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm">
                      <SortableHeader
                        label="GST Number"
                        sortKey="client_gst_no"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('client_gst_no' as any)}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm">
                      <SortableHeader
                        label="Email"
                        sortKey="client_email"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('client_email' as any)}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm">
                      <SortableHeader
                        label="Phone"
                        sortKey="client_phone"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('client_phone' as any)}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm">
                      <SortableHeader
                        label="Address"
                        sortKey="client_address"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('client_address' as any)}
                      />
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedClients.map((client: any) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {client.client_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {client.client_gst_no}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {client.client_email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {client.client_phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {client.client_address}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <Link href={`/clients/${client.id}/edit`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 flex items-center gap-1"
                            onClick={() => setDeleteConfirm({ id: client.id, name: client.client_name })}
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
        title="Delete Client"
        description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
    </ProtectRoute>
  );
}
