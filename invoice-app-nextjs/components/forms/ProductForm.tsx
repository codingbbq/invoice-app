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
      product_name: initialData?.product_name || initialData?.name || '',
      product_description: initialData?.product_description || initialData?.description || '',
      product_mrp: initialData?.product_mrp || initialData?.mrp || 0,
      product_hsn_code: initialData?.product_hsn_code || initialData?.hsnCode || '',
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
              {...register('product_name', { required: 'Product name is required' })}
              placeholder="Enter product name"
              disabled={isLoading}
            />
            {errors.product_name && (
              <p className="text-red-500 text-sm mt-1">{errors.product_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HSN Code *
            </label>
            <Input
              {...register('product_hsn_code', { required: 'HSN code is required' })}
              placeholder="Enter HSN code"
              disabled={isLoading}
            />
            {errors.product_hsn_code && (
              <p className="text-red-500 text-sm mt-1">{errors.product_hsn_code.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MRP (₹) *
            </label>
            <Input
              {...register('product_mrp', {
                required: 'MRP is required',
                valueAsNumber: true,
              })}
              type="number"
              step="0.01"
              placeholder="Enter MRP"
              disabled={isLoading}
            />
            {errors.product_mrp && (
              <p className="text-red-500 text-sm mt-1">{errors.product_mrp.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Input
              {...register('product_description', {
                required: 'Description is required',
              })}
              placeholder="Enter product description"
              disabled={isLoading}
            />
            {errors.product_description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.product_description.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
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
