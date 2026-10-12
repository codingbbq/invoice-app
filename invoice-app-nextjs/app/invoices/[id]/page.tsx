'use client';

import { useParams } from 'next/navigation';
import { useInvoice } from '@/hooks/useInvoices';
import { useClient } from '@/hooks/useClients';
import { InvoiceTemplate } from '@/components/invoice/invoice-template';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
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
      margin: 5,
      filename: `invoice-${invoice?.invoiceNumber}.pdf`,
      image: { type: 'png', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Invoice</title>');
      printWindow.document.write('<style>body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(invoiceRef.current.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice #{invoice.invoiceNumber}
          </h1>
          <p className="text-gray-600 mt-1">
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
        <div className="flex gap-3">
          <Button
            onClick={handlePrint}
            className="bg-gray-600 hover:bg-gray-700 flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div ref={invoiceRef} className="bg-white rounded-lg shadow-lg overflow-hidden">
        <InvoiceTemplate invoice={invoice} client={client} />
      </div>
    </div>
  );
}
