'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 5,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '50%',
  },
  value: {
    width: '50%',
    textAlign: 'right',
  },
  table: {
    marginBottom: 15,
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableCell: {
    flex: 1,
  },
  tableCellRight: {
    flex: 1,
    textAlign: 'right',
  },
  totalsSection: {
    marginTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#000000',
    paddingTop: 10,
  },
  totalRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 10,
  },
});

interface InvoicePDFProps {
  invoice: any;
  client: any;
}

export function InvoicePDF({ invoice, client }: InvoicePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Invoice #{invoice?.invoiceNumber}</Text>
        </View>

        {/* Client and Invoice Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.label}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Bill To:</Text>
              <Text>{client?.client_name}</Text>
              <Text>{client?.client_email}</Text>
              <Text>{client?.client_phone}</Text>
              <Text>{client?.client_address}</Text>
              <Text>GST: {client?.client_gst_no}</Text>
            </View>
            <View style={styles.label}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Invoice Details:</Text>
              <Text>Date: {invoice?.invoiceDate}</Text>
              <Text>Due Date: {invoice?.dueDate}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Item</Text>
            <Text style={styles.tableCellRight}>Qty</Text>
            <Text style={styles.tableCellRight}>Rate</Text>
            <Text style={styles.tableCellRight}>Amount</Text>
          </View>
          {invoice?.items?.map((item: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.productName}</Text>
              <Text style={styles.tableCellRight}>{item.quantity}</Text>
              <Text style={styles.tableCellRight}>₹{item.rate?.toFixed(2)}</Text>
              <Text style={styles.tableCellRight}>₹{item.totalCost?.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal:</Text>
            <Text style={styles.value}>₹{invoice?.subtotal?.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>CGST (9%):</Text>
            <Text style={styles.value}>₹{invoice?.cgst?.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>SGST (9%):</Text>
            <Text style={styles.value}>₹{invoice?.sgst?.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, { borderTopWidth: 2, borderTopColor: '#000000', paddingTop: 5 }]}>
            <Text style={styles.label}>Total:</Text>
            <Text style={styles.value}>₹{invoice?.total?.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
}
