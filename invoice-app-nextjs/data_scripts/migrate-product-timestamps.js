const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function migrateProductTimestamps() {
  try {
    console.log('Starting product timestamp migration...');
    
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const doc of snapshot.docs) {
      const product = doc.data();
      const updateData = {};
      let needsUpdate = false;
      
      // Check and convert createdAt
      if (product.createdAt && typeof product.createdAt === 'string') {
        console.log(`Converting createdAt for product ${doc.id}: ${product.createdAt}`);
        updateData.createdAt = Timestamp.fromDate(new Date(product.createdAt));
        needsUpdate = true;
      }
      
      // Check and convert updatedAt
      if (product.updatedAt && typeof product.updatedAt === 'string') {
        console.log(`Converting updatedAt for product ${doc.id}: ${product.updatedAt}`);
        updateData.updatedAt = Timestamp.fromDate(new Date(product.updatedAt));
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await productsRef.doc(doc.id).update(updateData);
        updatedCount++;
        console.log(`✓ Updated product ${doc.id}`);
      } else {
        skippedCount++;
      }
    }
    
    console.log(`\nMigration complete!`);
    console.log(`Updated: ${updatedCount} products`);
    console.log(`Skipped: ${skippedCount} products`);
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateProductTimestamps();
