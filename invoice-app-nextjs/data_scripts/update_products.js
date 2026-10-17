const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');
const data = require('./firebase_import.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function updateProducts() {
  console.log('Starting products update...');

  try {
    let updatedCount = 0;

    // Update Products collection with correct data
    for (const [productId, productData] of Object.entries(data.products)) {
      await db.collection('products').doc(productId).set(productData, { merge: false });
      updatedCount++;

      if (updatedCount % 50 === 0) {
        console.log(`Updated ${updatedCount} products...`);
      }
    }

    console.log(`✓ Successfully updated ${updatedCount} products!`);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
}

updateProducts().then(() => {
  console.log('Products update complete!');
  process.exit(0);
});
