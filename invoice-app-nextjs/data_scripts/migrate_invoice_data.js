const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function migrateInvoices() {
  console.log('Starting invoice data migration...');

  try {
    const invoicesRef = db.collection('invoices');
    const snapshot = await invoicesRef.get();

    let migratedCount = 0;

    for (const doc of snapshot.docs) {
      const invoice = doc.data();

      // Skip if already migrated (has total field)
      if (invoice.total !== undefined) {
        continue;
      }

      // Transform old schema to new schema
      const items = (invoice.products_object || []).map((product) => ({
        productId: product.product_id,
        mrp: parseFloat(product.mrp) || 0,
        quantity: parseInt(product.quantity) || 0,
        rate: parseFloat(product.rate) || 0,
        totalCost: parseFloat(product.each_product_final_cost) || 0,
      }));

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.totalCost, 0);
      const gstPercentage = invoice.invoice_vat || 0;
      const discountPercentage = invoice.invoice_discount || 0;

      // Calculate GST (assuming equal CGST and SGST)
      const gstAmount = (subtotal * gstPercentage) / 100;
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;

      // Calculate final total
      const total = subtotal + cgst + sgst;

      // Update document with new schema
      const updatedInvoice = {
        invoiceNumber: invoice.invoice_number || invoice.invoice_id,
        clientId: String(invoice.client_id),
        invoiceDate: invoice.invoice_date,
        items,
        gstPercentage,
        discountPercentage,
        subtotal,
        cgst,
        sgst,
        total,
        status: invoice.status || 'finalized',
      };

      await invoicesRef.doc(doc.id).update(updatedInvoice);
      migratedCount++;

      if (migratedCount % 100 === 0) {
        console.log(`Migrated ${migratedCount} invoices...`);
      }
    }

    console.log(`✓ Successfully migrated ${migratedCount} invoices!`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateInvoices().then(() => {
  console.log('Migration complete!');
  process.exit(0);
});
