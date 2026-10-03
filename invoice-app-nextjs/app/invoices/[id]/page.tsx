'use client';

import { useParams } from 'next/navigation';
import { useInvoice } from '@/hooks/useInvoices';
import { useClient } from '@/hooks/useClients';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useRef } from 'react';

export default function ViewInvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const { data: client } = useClient(invoice?.clientId || null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!invoiceRef.current) return;

    const element = invoiceRef.current;
    const opt: any = {
      margin: 10,
      filename: `invoice-${invoice?.invoiceNumber}.pdf`,
      image: { type: 'png', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading invoice...</p>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-12 text-center">
          <p className="text-gray-600">Invoice not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Invoice #{invoice.invoiceNumber}
          </h1>
          <p className="text-gray-600 mt-2">
            Status:{' '}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                invoice.status === 'finalized'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {invoice.status}
            </span>
          </p>
        </div>
        <Button
          onClick={handleDownloadPDF}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div ref={invoiceRef} className="bg-white p-8 rounded-lg shadow">
        {/* Invoice Header */}
        <div className="mb-8 pb-8 border-b">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">INVOICE</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Invoice #:</strong> {invoice.invoiceNumber}
                </p>
                <p>
                  <strong>Date:</strong> {invoice.invoiceDate}
                </p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bill To
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900">{client?.name}</p>
                <p>{client?.address}</p>
                <p>{client?.phone}</p>
                <p>{client?.email}</p>
                <p>
                  <strong>GST:</strong> {client?.gstNo}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  Rate
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoice.items?.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.productId}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900">
                    ₹{item.rate.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                    ₹{item.totalCost.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-1/3">
            <div className="space-y-2 border-t-2 border-gray-300 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Discount ({invoice.discountPercentage}%):
                </span>
                <span className="font-medium">
                  -₹
                  {(
                    (invoice.subtotal * invoice.discountPercentage) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-gray-600">CGST (9%):</span>
                <span className="font-medium">₹{invoice.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">SGST (9%):</span>
                <span className="font-medium">₹{invoice.sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t-2 border-gray-300 pt-2">
                <span>Total:</span>
                <span className="text-blue-600">₹{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-8 text-center text-xs text-gray-500">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}
