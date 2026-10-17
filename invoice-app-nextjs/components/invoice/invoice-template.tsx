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
    <div style={{ backgroundColor: '#ffffff', padding: '32px', color: '#111827', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '4px solid #111827' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.05em', margin: 0 }}>TAX INVOICE</h1>
      </div>

      {/* Company Details */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', margin: '0 0 4px 0' }}>{settings?.name || 'Company Name'}</h2>
        <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
          {settings?.address && `${settings.address}, `}
          {settings?.phone && `Ph No: ${settings.phone}`}
          {settings?.email && ` | ${settings.email}`}
        </p>
      </div>

      {/* Bill To and Invoice Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #9ca3af' }}>
        <div>
          <h3 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', margin: 0 }}>BILL TO:</h3>
          <p style={{ fontWeight: 'bold', fontSize: '14px', margin: 0 }}>{client?.client_name || 'Client Name'}</p>
          <p style={{ fontSize: '12px', color: '#374151', margin: 0 }}>{client?.client_address || ''}</p>
          {client?.client_gst_no && (
            <p style={{ fontSize: '12px', color: '#374151', margin: 0 }}>
              <strong>GSTIN:</strong> {client.client_gst_no}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right', fontSize: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Invoice #:</span>
            <span style={{ fontWeight: 'bold' }}>{invoice?.invoiceNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Invoice Date:</span>
            <span style={{ fontWeight: 'bold' }}>{invoice?.invoiceDate}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div style={{ marginBottom: '24px' }}>
        <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #9ca3af' }}>
              <th style={{ textAlign: 'left', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontWeight: 'bold', fontSize: '12px' }}>#</th>
              <th style={{ textAlign: 'left', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontWeight: 'bold', fontSize: '12px' }}>Item</th>
              <th style={{ textAlign: 'center', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontWeight: 'bold', fontSize: '12px' }}>HSN</th>
              <th style={{ textAlign: 'right', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontWeight: 'bold', fontSize: '12px' }}>MRP</th>
              <th style={{ textAlign: 'right', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontWeight: 'bold', fontSize: '12px' }}>Qty.</th>
              <th style={{ textAlign: 'right', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontWeight: 'bold', fontSize: '12px' }}>Rate</th>
              <th style={{ textAlign: 'right', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontWeight: 'bold', fontSize: '12px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice?.items?.map((item: any, index: number) => (
              <tr key={index} style={{ borderBottom: '1px solid #d1d5db' }}>
                <td style={{ textAlign: 'left', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontSize: '12px' }}>{index + 1}</td>
                <td style={{ textAlign: 'left', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontSize: '12px' }}>{item.productId}</td>
                <td style={{ textAlign: 'center', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontSize: '12px' }}>-</td>
                <td style={{ textAlign: 'right', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontSize: '12px' }}>{item.mrp}</td>
                <td style={{ textAlign: 'right', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontSize: '12px' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontSize: '12px' }}>₹{item.rate.toFixed(2)}</td>
                <td style={{ textAlign: 'right', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px', fontSize: '12px', fontWeight: '500' }}>₹{item.totalCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals and Notes Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '24px' }}>
        {/* Left: Notes */}
        <div>
          <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', margin: '0 0 8px 0' }}>Subject to Pune Jurisdiction</p>
          <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', margin: '0 0 8px 0' }}>
            {settings?.gstNumber && `GSTIN: ${settings.gstNumber}`}
          </p>
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', margin: '0 0 4px 0' }}>Amount in Words:</p>
            <p style={{ fontSize: '12px', lineHeight: '1.5', margin: 0 }}>
              {amountInWords.toUpperCase()}
              {paise > 0 && ` AND ${convertNumberToWords(paise).toUpperCase()} PAISE`}
              {' ONLY'}
            </p>
          </div>
        </div>

        {/* Right: Totals */}
        <div>
          <div style={{ fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Sub Total :</span>
              <span style={{ fontWeight: '500' }}>₹{invoice?.subtotal.toFixed(2)}</span>
            </div>
            {invoice?.discountPercentage > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Discount ({invoice.discountPercentage}%) :</span>
                <span style={{ fontWeight: '500' }}>
                  -₹{((invoice.subtotal * invoice.discountPercentage) / 100).toFixed(2)}
                </span>
              </div>
            )}
            <div style={{ borderTop: '1px solid #9ca3af', paddingTop: '4px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>CGST (9%) :</span>
                <span style={{ fontWeight: '500' }}>₹{invoice?.cgst.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>SGST (9%) :</span>
                <span style={{ fontWeight: '500' }}>₹{invoice?.sgst.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ borderTop: '2px solid #9ca3af', paddingTop: '4px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
              <span>Total :</span>
              <span>₹{invoice?.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '2px solid #9ca3af', paddingTop: '16px', textAlign: 'center', fontSize: '12px', color: '#4b5563' }}>
        <p style={{ margin: 0 }}>Thank you for your business!</p>
      </div>
    </div>
  );
}
