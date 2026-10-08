const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');
const data = require('./firebase_import.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function seedFirestore() {
  console.log('Starting Firestore import...');

  // Seed Clients collection
  for (const [clientId, clientData] of Object.entries(data.clients)) {
    await db.collection('clients').doc(clientId).set(clientData);
  }
  console.log(`Imported ${Object.keys(data.clients).length} clients.`);

  // Seed Invoices collection
  for (const [invoiceId, invoiceData] of Object.entries(data.invoices)) {
    await db.collection('invoices').doc(invoiceId).set(invoiceData);
  }
  console.log(`Imported ${Object.keys(data.invoices).length} invoices.`);

  console.log('Firestore seeding successfully finished!');
}

seedFirestore().catch(console.error);