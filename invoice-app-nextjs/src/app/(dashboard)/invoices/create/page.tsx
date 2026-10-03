'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClients } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';
import { useAddInvoice, useNextInvoiceNumber } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

interface InvoiceItem {
  productId: string;
  productName: string;
  mrp: number;
  quantity: number;
  rate: number;
  totalCost: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const { data: clients = [] } = useClients();
  const { data: products = [] } = useProducts();
  const { data: nextInvoiceNumber = 1 } = useNextInvoiceNumber();
  const addInvoice = useAddInvoice();

  const [formData, setFormData] = useState({
    clientId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceNumber: nextInvoiceNumber,
    gstPercentage: 18,
    discountPercentage: 0,
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      productId: '',
      productName: '',
      mrp: 0,
      quantity: 0,
      rate: 0,
      totalCost: 0,
    },
  ]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      invoiceNumber: nextInvoiceNumber,
    }));
  }, [nextInvoiceNumber]);

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.totalCost, 0);
    const discountAmount = (subtotal * formData.discountPercentage) / 100;
    const subtotalAfterDiscount = subtotal - discountAmount;
    const gstAmount = (subtotalAfterDiscount * formData.gstPercentage) / 100;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const total = subtotalAfterDiscount + gstAmount;

    return {
      subtotal,
      discountAmount,
      subtotalAfterDiscount,
      cgst,
      sgst,
      gstAmount,
      total,
    };
  };

  const totals = calculateTotals();

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = newItems[index];

    if (field === 'productId') {
      const product = products.find((p: any) => p.id === value);
      if (product) {
        item.productId = value;
        item.productName = product.name;
        item.mrp = product.mrp;
        item.rate = product.mrp;
      }
    } else if (field === 'quantity') {
      item.quantity = parseFloat(value) || 0;
    } else if (field === 'rate') {
      item.rate = parseFloat(value) || 0;
    }

    item.totalCost = item.quantity * item.rate;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: '',
        productName: '',
        mrp: 0,
        quantity: 0,
        rate: 0,
        totalCost: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId) {
      alert('Please select a client');
      return;
    }

    if (items.length === 0 || items.some((item) => !item.productId)) {
      alert('Please add at least one product');
      return;
    }

    try {
      const invoiceData = {
        clientId: formData.clientId,
        invoiceDate: formData.invoiceDate,
        invoiceNumber: formData.invoiceNumber,
        items: items.map((item) => ({
          productId: item.productId,
          mrp: item.mrp,
          quantity: item.quantity,
          rate: item.rate,
          totalCost: item.totalCost,
        })),
        gstPercentage: formData.gstPercentage,
        discountPercentage: formData.discountPercentage,
        subtotal: totals.subtotal,
        cgst: totals.cgst,
        sgst: totals.sgst,
        total: totals.total,
        status: 'draft',
      };

      await addInvoice.mutateAsync(invoiceData as any);
      router.push('/invoices');
    } catch (error) {
      console.error('Failed to create invoice:', error);
      alert('Failed to create invoice');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Create Invoice</h1>
        <p className="text-gray-600 mt-2">Create a new invoice for your client</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Invoice Header */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number
              </label>
              <Input
                type="number"
                value={formData.invoiceNumber}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Date *
              </label>
              <Input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceDate: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client *
              </label>
              <select
                value={formData.clientId}
                onChange={(e) =>
                  setFormData({ ...formData, clientId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Client</option>
                {clients.map((client: any) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST %
              </label>
              <select
                value={formData.gstPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gstPercentage: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Invoice Items */}
        <Card className="p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                  HSN
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                  MRP
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                  Qty
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                  Rate
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                  Total
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        handleItemChange(index, 'productId', e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((product: any) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {item.mrp > 0
                      ? products.find((p: any) => p.id === item.productId)
                          ?.hsnCode || '-'
                      : '-'}
                  </td>
                  <td className="px-4 py-2 text-right text-sm">
                    ₹{item.mrp.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, 'quantity', e.target.value)
                      }
                      className="w-full text-right text-sm"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(index, 'rate', e.target.value)
                      }
                      className="w-full text-right text-sm"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-medium">
                    ₹{item.totalCost.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button
            type="button"
            variant="outline"
            className="mt-4 flex items-center gap-2"
            onClick={addItem}
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </Card>

        {/* Totals */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount ({formData.discountPercentage}%):</span>
                  <span className="font-medium">
                    -₹{totals.discountAmount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      After Discount:
                    </span>
                    <span className="font-medium">
                      ₹{totals.subtotalAfterDiscount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">CGST (9%):</span>
                  <span className="font-medium">₹{totals.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SGST (9%):</span>
                  <span className="font-medium">₹{totals.sgst.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 border-b pb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST Total:</span>
                    <span className="font-medium">
                      ₹{totals.gstAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">₹{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Discount %:
              </span>
              <Input
                type="number"
                value={formData.discountPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountPercentage: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-20"
                step="0.01"
                min="0"
                max="100"
              />
            </label>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={addInvoice.isPending}
          >
            {addInvoice.isPending ? 'Creating...' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </div>
  );
}
