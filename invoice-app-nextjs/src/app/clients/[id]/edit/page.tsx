'use client';

import { useRouter, useParams } from 'next/navigation';
import { useClient, useUpdateClient } from '@/hooks/useClients';
import { ClientForm } from '@/components/forms/ClientForm';
import { Card } from '@/components/ui/card';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  
  const { data: client, isLoading } = useClient(clientId);
  const updateClient = useUpdateClient();

  const handleSubmit = async (data: any) => {
    try {
      await updateClient.mutateAsync({ id: clientId, data });
      router.push('/clients');
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading client...</p>
        </Card>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-12 text-center">
          <p className="text-gray-600">Client not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Edit Client</h1>
        <p className="text-gray-600 mt-2">Update client information</p>
      </div>

      <ClientForm 
        initialData={client} 
        onSubmit={handleSubmit} 
        isLoading={updateClient.isPending} 
      />
    </div>
  );
}
