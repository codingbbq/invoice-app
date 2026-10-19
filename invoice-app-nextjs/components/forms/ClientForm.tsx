'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Client } from '@/lib/firestore';

interface ClientFormProps {
  initialData?: Client & { id: string };
  onSubmit: (data: Omit<Client, 'id'>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ClientForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      client_name: initialData?.client_name || '',
      client_email: initialData?.client_email || '',
      client_phone: initialData?.client_phone || '',
      client_gst_no: initialData?.client_gst_no || '',
      client_address: initialData?.client_address || '',
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
              {...register('client_name', { required: 'Client name is required' })}
              placeholder="Enter client name"
              disabled={isLoading}
            />
            {errors.client_name && (
              <p className="text-red-500 text-sm mt-1">{errors.client_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GST Number *
            </label>
            <Input
              {...register('client_gst_no', { required: 'GST number is required' })}
              placeholder="Enter GST number"
              disabled={isLoading}
            />
            {errors.client_gst_no && (
              <p className="text-red-500 text-sm mt-1">{errors.client_gst_no.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <Input
              {...register('client_email', {
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
            {errors.client_email && (
              <p className="text-red-500 text-sm mt-1">{errors.client_email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <Input
              {...register('client_phone', { required: 'Phone number is required' })}
              placeholder="Enter phone number"
              disabled={isLoading}
            />
            {errors.client_phone && (
              <p className="text-red-500 text-sm mt-1">{errors.client_phone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <Input
              {...register('client_address', { required: 'Address is required' })}
              placeholder="Enter address"
              disabled={isLoading}
            />
            {errors.client_address && (
              <p className="text-red-500 text-sm mt-1">{errors.client_address.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Client' : 'Add Client'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
