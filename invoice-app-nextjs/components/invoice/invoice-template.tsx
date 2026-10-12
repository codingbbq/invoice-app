'use client';

import { useQuery } from '@tanstack/react-query';

export interface InvoiceTemplateProps {
  invoice: any;
  client: any;
}

export function InvoiceTemplate({ invoice, client }: InvoiceTemplateProps) {
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

  const convertNumberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Lakh', 'Crore'];

    if (num === 0) return 'Zero';

    let words = '';
    let scaleIndex = 0;

    while (num > 0) {
      let groupValue = num % 100;
      if (scaleIndex === 0) {
        groupValue = num % 1000;
      }

      if (groupValue > 0) {
        let groupWords = '';
        const hundreds = Math.floor(groupValue / 100);
        const remainder = groupValue % 100;

        if (hundreds > 0) {
          groupWords += ones[hundreds] + ' Hundred ';
        }

        if (remainder >= 10 && remainder < 20) {
          groupWords += teens[remainder - 10] + ' ';
        } else {
          const ten = Math.floor(remainder / 10);
          const one = remainder % 10;
          if (ten > 0) {
            groupWords += tens[ten] + ' ';
          }
          if (one > 0) {
            groupWords += ones[one] + ' ';
          }
        }

        if (scaleIndex > 0) {
          groupWords += scales[scaleIndex] + ' ';
        }

        words = groupWords + words;
      }

      if (scaleIndex === 0) {
        num = Math.floor(num / 1000);
      } else {
        num = Math.floor(num / 100);
      }
      scaleIndex++;
    }

    return words.trim();
  };

  const amountInWords = convertNumberToWords(Math.floor(invoice?.total || 0));
  const paise = Math.round(((invoice?.total || 0) % 1) * 100);

  return (
    <div className="bg-white p-8 text-gray-900 font-serif" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-4 border-gray-900">
        <h1 className="text-2xl font-bold tracking-wide">TAX INVOICE</h1>
      </div>

      {/* Company Details */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">{settings?.name || 'Company Name'}</h2>
        <p className="text-sm text-gray-700">
          {settings?.address && `${settings.address}, `}
          {settings?.phone && `Ph No: ${settings.phone}`}
          {settings?.email && ` | ${settings.email}`}
        </p>
      </div>

      {/* Bill To and Invoice Details */}
      <div className="grid grid-cols-2 gap-8 mb-6 pb-4 border-b-2 border-gray-400">
        <div>
          <h3 className="font-bold text-sm mb-2">BILL TO:</h3>
          <p className="font-bold text-sm">{client?.client_name || 'Client Name'}</p>
          <p className="text-xs text-gray-700">{client?.client_address || ''}</p>
          {client?.client_gst_no && (
            <p className="text-xs text-gray-700">
              <strong>GSTIN:</strong> {client.client_gst_no}
            </p>
          )}
        </div>
        <div className="text-right text-sm">
          <div className="flex justify-between mb-1">
            <span>Invoice #:</span>
            <span className="font-bold">{invoice?.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Invoice Date:</span>
            <span className="font-bold">{invoice?.invoiceDate}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-400">
              <th className="text-left py-2 px-2 font-bold text-xs">#</th>
              <th className="text-left py-2 px-2 font-bold text-xs">Item</th>
              <th className="text-center py-2 px-2 font-bold text-xs">HSN</th>
              <th className="text-right py-2 px-2 font-bold text-xs">MRP</th>
              <th className="text-right py-2 px-2 font-bold text-xs">Qty.</th>
              <th className="text-right py-2 px-2 font-bold text-xs">Rate</th>
              <th className="text-right py-2 px-2 font-bold text-xs">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice?.items?.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="text-left py-2 px-2 text-xs">{index + 1}</td>
                <td className="text-left py-2 px-2 text-xs">{item.productId}</td>
                <td className="text-center py-2 px-2 text-xs">-</td>
                <td className="text-right py-2 px-2 text-xs">{item.mrp}</td>
                <td className="text-right py-2 px-2 text-xs">{item.quantity}</td>
                <td className="text-right py-2 px-2 text-xs">₹{item.rate.toFixed(2)}</td>
                <td className="text-right py-2 px-2 text-xs font-medium">₹{item.totalCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals and Notes Section */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        {/* Left: Notes */}
        <div>
          <p className="text-xs font-bold mb-2">Subject to Pune Jurisdiction</p>
          <p className="text-xs font-bold mb-2">
            {settings?.gstNumber && `GSTIN: ${settings.gstNumber}`}
          </p>
          <div className="mt-4">
            <p className="text-xs font-bold mb-1">Amount in Words:</p>
            <p className="text-xs leading-relaxed">
              {amountInWords.toUpperCase()}
              {paise > 0 && ` AND ${paise} PAISE`}
              {' ONLY'}
            </p>
          </div>
        </div>

        {/* Right: Totals */}
        <div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Sub Total :</span>
              <span className="font-medium">₹{invoice?.subtotal.toFixed(2)}</span>
            </div>
            {invoice?.discountPercentage > 0 && (
              <div className="flex justify-between">
                <span>Discount ({invoice.discountPercentage}%) :</span>
                <span className="font-medium">
                  -₹{((invoice.subtotal * invoice.discountPercentage) / 100).toFixed(2)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-400 pt-1 mt-1">
              <div className="flex justify-between">
                <span>CGST (9%) :</span>
                <span className="font-medium">₹{invoice?.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (9%) :</span>
                <span className="font-medium">₹{invoice?.sgst.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t-2 border-gray-400 pt-1 mt-1 flex justify-between font-bold text-sm">
              <span>Total :</span>
              <span>₹{invoice?.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-400 pt-4 text-center text-xs text-gray-600">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
}
