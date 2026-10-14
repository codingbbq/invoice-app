'use client';

export interface InvoicePDFTemplateProps {
  invoice: any;
  client: any;
  settings: any;
}

export function InvoicePDFTemplate({ invoice, client, settings }: InvoicePDFTemplateProps) {
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

  const styles = `
    body {
      font-family: Arial, sans-serif;
      color: #111827;
      background-color: #ffffff;
    }
    .invoice-container {
      padding: 32px;
      background-color: #ffffff;
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 4px solid #111827;
    }
    .header h1 {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 0.05em;
      margin: 0;
    }
    .company-details {
      margin-bottom: 24px;
    }
    .company-details h2 {
      font-size: 20px;
      font-weight: bold;
      margin: 0 0 4px 0;
    }
    .company-details p {
      font-size: 14px;
      color: #374151;
      margin: 0;
    }
    .bill-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #9ca3af;
    }
    .bill-to h3 {
      font-weight: bold;
      font-size: 14px;
      margin: 0 0 8px 0;
    }
    .bill-to p {
      margin: 0;
      font-size: 14px;
    }
    .bill-to .name {
      font-weight: bold;
    }
    .bill-to .details {
      font-size: 12px;
      color: #374151;
    }
    .invoice-details {
      text-align: right;
      font-size: 14px;
    }
    .invoice-details-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .invoice-details-row span:last-child {
      font-weight: bold;
    }
    .items-table {
      width: 100%;
      margin-bottom: 24px;
      border-collapse: collapse;
      font-size: 14px;
    }
    .items-table thead tr {
      border-bottom: 2px solid #9ca3af;
    }
    .items-table th {
      text-align: left;
      padding: 8px;
      font-weight: bold;
      font-size: 12px;
    }
    .items-table th.center {
      text-align: center;
    }
    .items-table th.right {
      text-align: right;
    }
    .items-table tbody tr {
      border-bottom: 1px solid #d1d5db;
    }
    .items-table td {
      padding: 8px;
      font-size: 12px;
    }
    .items-table td.center {
      text-align: center;
    }
    .items-table td.right {
      text-align: right;
    }
    .totals-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 24px;
    }
    .notes p {
      font-size: 12px;
      font-weight: bold;
      margin: 0 0 8px 0;
    }
    .amount-words {
      margin-top: 16px;
    }
    .amount-words p {
      font-size: 12px;
      margin: 0;
    }
    .amount-words .label {
      font-weight: bold;
      margin-bottom: 4px;
    }
    .totals {
      font-size: 12px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .total-row.bold {
      font-weight: 500;
    }
    .total-row.final {
      border-top: 2px solid #9ca3af;
      padding-top: 4px;
      margin-top: 4px;
      font-weight: bold;
      font-size: 14px;
    }
    .divider {
      border-top: 1px solid #9ca3af;
      padding-top: 4px;
      margin-top: 4px;
    }
    .footer {
      border-top: 2px solid #9ca3af;
      padding-top: 16px;
      text-align: center;
      font-size: 12px;
      color: #4b5563;
    }
    .footer p {
      margin: 0;
    }
  `;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#111827', backgroundColor: '#ffffff', padding: '32px' }}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="invoice-container">
        {/* Header */}
        <div className="header">
          <h1>TAX INVOICE</h1>
        </div>

        {/* Company Details */}
        <div className="company-details">
          <h2>{settings?.name || 'Company Name'}</h2>
          <p>
            {settings?.address && `${settings.address}, `}
            {settings?.phone && `Ph No: ${settings.phone}`}
            {settings?.email && ` | ${settings.email}`}
          </p>
        </div>

        {/* Bill To and Invoice Details */}
        <div className="bill-section">
          <div className="bill-to">
            <h3>BILL TO:</h3>
            <p className="name">{client?.client_name || 'Client Name'}</p>
            <p className="details">{client?.client_address || ''}</p>
            {client?.client_gst_no && (
              <p className="details">
                <strong>GSTIN:</strong> {client.client_gst_no}
              </p>
            )}
          </div>
          <div className="invoice-details">
            <div className="invoice-details-row">
              <span>Invoice #:</span>
              <span>{invoice?.invoiceNumber}</span>
            </div>
            <div className="invoice-details-row">
              <span>Invoice Date:</span>
              <span>{invoice?.invoiceDate}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="items-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th className="center">HSN</th>
              <th className="right">MRP</th>
              <th className="right">Qty.</th>
              <th className="right">Rate</th>
              <th className="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice?.items?.map((item: any, index: number) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.productId}</td>
                <td className="center">-</td>
                <td className="right">{item.mrp}</td>
                <td className="right">{item.quantity}</td>
                <td className="right">₹{item.rate.toFixed(2)}</td>
                <td className="right" style={{ fontWeight: '500' }}>₹{item.totalCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals and Notes Section */}
        <div className="totals-section">
          {/* Left: Notes */}
          <div className="notes">
            <p>Subject to Pune Jurisdiction</p>
            <p>{settings?.gstNumber && `GSTIN: ${settings.gstNumber}`}</p>
            <div className="amount-words">
              <p className="label">Amount in Words:</p>
              <p>
                {amountInWords.toUpperCase()}
                {paise > 0 && ` AND ${paise} PAISE`}
                {' ONLY'}
              </p>
            </div>
          </div>

          {/* Right: Totals */}
          <div className="totals">
            <div className="total-row bold">
              <span>Sub Total :</span>
              <span>₹{invoice?.subtotal.toFixed(2)}</span>
            </div>
            {invoice?.discountPercentage > 0 && (
              <div className="total-row bold">
                <span>Discount ({invoice.discountPercentage}%) :</span>
                <span>-₹{((invoice.subtotal * invoice.discountPercentage) / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="divider">
              <div className="total-row bold">
                <span>CGST (9%) :</span>
                <span>₹{invoice?.cgst.toFixed(2)}</span>
              </div>
              <div className="total-row bold">
                <span>SGST (9%) :</span>
                <span>₹{invoice?.sgst.toFixed(2)}</span>
              </div>
            </div>
            <div className="total-row final">
              <span>Total :</span>
              <span>₹{invoice?.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}
