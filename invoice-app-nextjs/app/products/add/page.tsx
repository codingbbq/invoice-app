'use client';

import { useRouter } from 'next/navigation';
import { useAddProduct } from '@/hooks/useProducts';
import { ProductForm } from '@/components/forms/ProductForm';

export default function AddProductPage() {
  const router = useRouter();
  const addProduct = useAddProduct();

  const handleSubmit = async (data: any) => {
    try {
      await addProduct.mutateAsync(data);
      router.push('/products');
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">Fill in the details below to add a new product</p>
      </div>

      <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={addProduct.isPending} />
    </div>
  );
}
