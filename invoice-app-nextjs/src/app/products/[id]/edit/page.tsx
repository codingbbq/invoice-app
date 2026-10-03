'use client';

import { useRouter, useParams } from 'next/navigation';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';
import { ProductForm } from '@/components/forms/ProductForm';
import { Card } from '@/components/ui/card';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const { data: product, isLoading } = useProduct(productId);
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (data: any) => {
    try {
      await updateProduct.mutateAsync({ id: productId, data });
      router.push('/products');
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading product...</p>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-12 text-center">
          <p className="text-gray-600">Product not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product information</p>
      </div>

      <ProductForm 
        initialData={product} 
        onSubmit={handleSubmit} 
        isLoading={updateProduct.isPending} 
      />
    </div>
  );
}
