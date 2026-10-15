const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');
const data = require('./firebase_import.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function seedProducts() {
  console.log('Starting products import...');

  try {
    let importedCount = 0;

    // Seed Products collection
    for (const [productId, productData] of Object.entries(data.products)) {
      await db.collection('products').doc(productId).set(productData);
      importedCount++;

      if (importedCount % 50 === 0) {
        console.log(`Imported ${importedCount} products...`);
      }
    }

    console.log(`✓ Successfully imported ${importedCount} products!`);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

seedProducts().then(() => {
  console.log('Products seeding complete!');
  process.exit(0);
});
