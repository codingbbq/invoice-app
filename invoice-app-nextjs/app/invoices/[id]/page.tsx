'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useInvoice } from '@/hooks/useInvoices';
import { useClient } from '@/hooks/useClients';
import { InvoiceTemplate } from '@/components/invoice/invoice-template';
import { InvoicePDFTemplate } from '@/components/invoice/invoice-pdf-template';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useRef, useState } from 'react';

export default function ViewInvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const { data: client } = useClient(invoice?.clientId || null);
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
  
  const invoiceRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    
    setIsDownloading(true);
    try {
      // Dynamically import html2pdf to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = pdfRef.current;
      const opt: any = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `invoice-${invoice?.invoiceNumber}.pdf`,
        image: { type: 'png', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          orientation: 'portrait', 
          unit: 'mm', 
          format: 'a4',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
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
        <Button
          onClick={handleDownloadPDF}
          variant="primary"
          className="flex items-center gap-2"
          disabled={isDownloading}
        >
          <Download className="h-4 w-4" />
          {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </div>

      <div ref={invoiceRef} className="bg-white rounded-lg shadow-lg overflow-hidden">
        <InvoiceTemplate invoice={invoice} client={client} />
      </div>

      {/* Hidden PDF template for download */}
      <div ref={pdfRef} style={{ display: 'none' }}>
        <InvoicePDFTemplate invoice={invoice} client={client} settings={settings} />
      </div>
    </div>
  );
}
