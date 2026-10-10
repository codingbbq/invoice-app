'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/hooks/useSearch';
import { useSort } from '@/hooks/useSort';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { SortableHeader } from '@/components/ui/sortable-header';
import { Trash2, Edit, Plus } from 'lucide-react';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const { items: searchedProducts, searchQuery, setSearchQuery, clearSearch } = useSearch({
    data: products,
    searchFields: ['name', 'description', 'hsnCode'] as const,
  });
  
  const { items: sortedProducts, sortConfig, toggleSort } = useSort(searchedProducts);
  
  const { items: paginatedProducts, pagination, goToPage, setPageSize } = usePagination(sortedProducts, 10);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your products and pricing</p>
        </div>
        <Link href="/products/add">
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
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
            <Button className="bg-blue-600 hover:bg-blue-700">Add Your First Product</Button>
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
                        sortKey="name"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('name' as any)}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm">
                      <SortableHeader
                        label="HSN Code"
                        sortKey="hsnCode"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('hsnCode' as any)}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm">
                      <SortableHeader
                        label="Description"
                        sortKey="description"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('description' as any)}
                      />
                    </th>
                    <th className="px-6 py-3 text-right text-sm">
                      <SortableHeader
                        label="MRP"
                        sortKey="mrp"
                        currentSortKey={sortConfig?.key as string | undefined}
                        sortDirection={sortConfig?.direction}
                        onSort={() => toggleSort('mrp' as any)}
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
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.hsnCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.description}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        ₹{product.mrp.toFixed(2)}
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
                          {deleteConfirm === product.id ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(product.id)}
                                disabled={deleteProduct.isPending}
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
                              onClick={() => setDeleteConfirm(product.id)}
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
    </div>
  );
}
