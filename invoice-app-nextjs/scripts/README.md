# Migration Scripts

## migrate-product-timestamps.js

This script converts product timestamps from ISO string format to Firestore Timestamp objects.

### Prerequisites

1. Ensure you have a `firebase-service-account.json` file in the project root
2. Install dependencies: `npm install firebase-admin`

### Usage

```bash
node scripts/migrate-product-timestamps.js
```

### What it does

- Finds all products in the Firestore database
- Converts `createdAt` field from ISO string to Firestore Timestamp
- Converts `updatedAt` field from ISO string to Firestore Timestamp
- Logs progress and results

### Notes

- This script is safe to run multiple times - it only converts string timestamps
- Already-converted Timestamp objects are skipped
- The script will exit with code 0 on success, 1 on failure
