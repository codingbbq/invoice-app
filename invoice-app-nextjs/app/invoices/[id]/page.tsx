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
      
      // Move element off-screen instead of showing it
      const originalPosition = element.style.position;
      const originalLeft = element.style.left;
      const originalTop = element.style.top;
      const originalVisibility = element.style.visibility;
      
      element.style.position = 'fixed';
      element.style.left = '-9999px';
      element.style.top = '-9999px';
      element.style.visibility = 'hidden';
      
      const opt: any = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `invoice-${invoice?.invoiceNumber}.pdf`,
        image: { type: 'png', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false
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
      
      // Restore original position
      element.style.position = originalPosition;
      element.style.left = originalLeft;
      element.style.top = originalTop;
      element.style.visibility = originalVisibility;
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

      {/* Hidden PDF template for download - positioned off-screen */}
      <div ref={pdfRef} style={{ position: 'fixed', left: '-9999px', top: '-9999px', visibility: 'hidden' }}>
        <InvoicePDFTemplate invoice={invoice} client={client} settings={settings} />
      </div>
    </div>
  );
}
