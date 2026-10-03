'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      gstNumber: '',
      cstNumber: '',
    },
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await updateSettings.mutateAsync(data);
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading settings...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your company information</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <Input
                {...register('name', { required: 'Company name is required' })}
                placeholder="Enter company name"
                defaultValue={settings?.name || ''}
                disabled={updateSettings.isPending}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
                placeholder="Enter email"
                defaultValue={settings?.email || ''}
                disabled={updateSettings.isPending}
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
                {...register('phone', { required: 'Phone is required' })}
                placeholder="Enter phone number"
                defaultValue={settings?.phone || ''}
                disabled={updateSettings.isPending}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Number
              </label>
              <Input
                {...register('gstNumber')}
                placeholder="Enter GST number"
                defaultValue={settings?.gstNumber || ''}
                disabled={updateSettings.isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CST Number
              </label>
              <Input
                {...register('cstNumber')}
                placeholder="Enter CST number"
                defaultValue={settings?.cstNumber || ''}
                disabled={updateSettings.isPending}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <Input
                {...register('address', { required: 'Address is required' })}
                placeholder="Enter address"
                defaultValue={settings?.address || ''}
                disabled={updateSettings.isPending}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={updateSettings.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
