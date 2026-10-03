'use client';

import { useRouter } from 'next/navigation';
import { useAddClient } from '@/hooks/useClients';
import { ClientForm } from '@/components/forms/ClientForm';
import { Card } from '@/components/ui/card';

export default function AddClientPage() {
  const router = useRouter();
  const addClient = useAddClient();

  const handleSubmit = async (data: any) => {
    try {
      await addClient.mutateAsync(data);
      router.push('/clients');
    } catch (error) {
      console.error('Failed to add client:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Add New Client</h1>
        <p className="text-gray-600 mt-2">Fill in the details below to add a new client</p>
      </div>

      <ClientForm onSubmit={handleSubmit} isLoading={addClient.isPending} />
    </div>
  );
}
