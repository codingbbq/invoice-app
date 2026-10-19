'use client';

import { useParams } from 'next/navigation';
import { useInvoice } from '@/hooks/useInvoices';
import { useClient } from '@/hooks/useClients';
import { InvoiceTemplate } from '@/components/invoice/invoice-template';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useRef, useState } from 'react';

export default function ViewInvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const { data: client } = useClient(invoice?.clientId || null);
  
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');
      const element = invoiceRef.current;
      
      // Generate canvas from element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Get canvas dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, position + 10, imgWidth - 20, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position + 10, imgWidth - 20, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save(`invoice-${invoice?.invoiceNumber}.pdf`);
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
    </div>
  );
}
