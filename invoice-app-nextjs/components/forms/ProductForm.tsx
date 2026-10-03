'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Product } from '@/lib/firestore';

interface ProductFormProps {
  initialData?: Product & { id: string };
  onSubmit: (data: Omit<Product, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      mrp: initialData?.mrp || 0,
      hsnCode: initialData?.hsnCode || '',
    },
  });

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <Input
              {...register('name', { required: 'Product name is required' })}
              placeholder="Enter product name"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HSN Code *
            </label>
            <Input
              {...register('hsnCode', { required: 'HSN code is required' })}
              placeholder="Enter HSN code"
              disabled={isLoading}
            />
            {errors.hsnCode && (
              <p className="text-red-500 text-sm mt-1">{errors.hsnCode.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MRP (₹) *
            </label>
            <Input
              {...register('mrp', {
                required: 'MRP is required',
                valueAsNumber: true,
              })}
              type="number"
              step="0.01"
              placeholder="Enter MRP"
              disabled={isLoading}
            />
            {errors.mrp && (
              <p className="text-red-500 text-sm mt-1">{errors.mrp.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Input
              {...register('description', {
                required: 'Description is required',
              })}
              placeholder="Enter product description"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading
              ? 'Saving...'
              : initialData
                ? 'Update Product'
                : 'Add Product'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
