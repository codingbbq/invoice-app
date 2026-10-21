'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
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
import { Trash2, Edit, Plus, Package, Hash, IndianRupee, Percent } from 'lucide-react';
import { ProtectRoute } from '@/components/auth/ProtectRoute';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { items: searchedProducts, searchQuery, setSearchQuery, clearSearch } = useSearch({
    data: products,
    searchFields: ['product_name', 'product_description', 'product_hsn_code'] as const,
  });
  
  // Sort by createdAt descending by default (latest first)
  const sortedByDate = [...searchedProducts].sort((a: any, b: any) => {
    let dateA = new Date(0);
    let dateB = new Date(0);
    
    // Handle both Firestore Timestamp objects and ISO strings
    if (a.createdAt) {
      if (typeof a.createdAt === 'string') {
        dateA = new Date(a.createdAt);
      } else if (a.createdAt.toDate) {
        dateA = a.createdAt.toDate();
      } else {
        dateA = new Date(a.createdAt);
      }
    }
    
    if (b.createdAt) {
      if (typeof b.createdAt === 'string') {
        dateB = new Date(b.createdAt);
      } else if (b.createdAt.toDate) {
        dateB = b.createdAt.toDate();
      } else {
        dateB = new Date(b.createdAt);
      }
    }
    
    return dateB.getTime() - dateA.getTime();
  });
  
  // Use the pre-sorted data directly without useSort to maintain date ordering
  const sortedProducts = sortedByDate;
  const sortConfig = { key: 'createdAt' as any, direction: 'desc' as const };
  const toggleSort = (key: any) => {}; // No-op since we're using fixed date sort
  
  const { items: paginatedProducts, pagination, goToPage, setPageSize } = usePagination(sortedProducts, 10);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteProduct.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
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
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Products</h1>
              <p className="text-sm text-gray-500">Manage your products and pricing</p>
            </div>
            <Link href="/products/add">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>

      {products.length > 0 && (
        <div className="mb-8">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={clearSearch}
            placeholder="Search by product name, description, or HSN code..."
            resultCount={searchedProducts.length}
            totalCount={products.length}
          />
        </div>
      )}

      {isLoading ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading products...</p>
        </Card>
      ) : products.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">No products found</p>
          <Link href="/products/add">
            <Button variant="primary">Add Your First Product</Button>
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
                        label="Name"
                        sortKey="product_name"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('product_name' as any)}
                        icon={Package}
                      />
                    </th>
                    <th className="px-6 py-4 text-left">
                      <SortableHeader
                        label="HSN Code"
                        sortKey="product_hsn_code"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('product_hsn_code' as any)}
                        icon={Hash}
                      />
                    </th>
                    <th className="px-6 py-4 text-left">
                      <SortableHeader
                        label="Description"
                        sortKey="product_description"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('product_description' as any)}
                      />
                    </th>
                    <th className="px-6 py-4 text-right">
                      <SortableHeader
                        label="MRP"
                        sortKey="product_mrp"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('product_mrp' as any)}
                      />
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedProducts.map((product: any) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {product.product_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.product_hsn_code}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.product_description}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        ₹{parseFloat(product.product_mrp).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <Link href={`/products/${product.id}/edit`}>
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
                            onClick={() => setDeleteConfirm({ id: product.id, name: product.product_name })}
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
            title="Delete Product"
            description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
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
