'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
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
      const element = invoiceRef.current;
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        throw new Error('Failed to open print window. Please check popup blocker settings.');
      }

      // Get the HTML content
      const htmlContent = element.innerHTML;
      
      // Write HTML with print-friendly styles
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice ${invoice?.invoiceNumber}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                line-height: 1.5;
                color: #000;
                background: #fff;
              }
              
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
              }
              
              @page {
                size: A4;
                margin: 10mm;
              }
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              window.addEventListener('load', function() {
                window.print();
              });
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Set a timeout to close the window after printing
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
        }
        setIsDownloading(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
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
