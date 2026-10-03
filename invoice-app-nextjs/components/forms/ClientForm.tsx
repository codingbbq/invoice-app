'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Client } from '@/lib/firestore';

interface ClientFormProps {
  initialData?: Client & { id: string };
  onSubmit: (data: Omit<Client, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

export function ClientForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      gstNo: initialData?.gstNo || '',
      address: initialData?.address || '',
    },
  });

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name *
            </label>
            <Input
              {...register('name', { required: 'Client name is required' })}
              placeholder="Enter client name"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GST Number *
            </label>
            <Input
              {...register('gstNo', { required: 'GST number is required' })}
              placeholder="Enter GST number"
              disabled={isLoading}
            />
            {errors.gstNo && (
              <p className="text-red-500 text-sm mt-1">{errors.gstNo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <Input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              type="email"
              placeholder="Enter email address"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <Input
              {...register('phone', { required: 'Phone number is required' })}
              placeholder="Enter phone number"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <Input
              {...register('address', { required: 'Address is required' })}
              placeholder="Enter address"
              disabled={isLoading}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Client' : 'Add Client'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
