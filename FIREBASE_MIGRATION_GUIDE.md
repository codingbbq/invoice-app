# Firebase Migration Guide

## Overview
This guide provides two approaches to migrate your SQL database to Firebase:
1. **Direct SQL Import** - Using Firebase's SQL import feature (if available)
2. **Manual Conversion** - Converting SQL structure to Firestore/Realtime Database format

---

## Approach 1: Using Firebase SQL Connector (Recommended for Large Data)

Firebase doesn't have a direct SQL import tool, but you can use **Dataflow** (Google Cloud's ETL service):

### Steps:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Dataflow API**
3. Use the **SQL to Firestore** template:
   - Source: Your MySQL database (or exported SQL file)
   - Destination: Firestore collection
4. Map your tables to Firestore collections

---

## Approach 2: Convert SQL to Firebase JSON Format (Recommended for Quick Setup)

### Table Structure Analysis

Your database has 4 tables:

#### 1. **clients** table
```sql
CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `client_gst_no` varchar(255) NOT NULL,
  `client_address` varchar(255) NOT NULL,
  `client_email` varchar(255) NOT NULL,
  `client_phone` varchar(255) NOT NULL
)
```

**Firebase Firestore Structure:**
```
/clients/{client_id}
  ├── client_id: number
  ├── client_name: string
  ├── client_gst_no: string
  ├── client_address: string
  ├── client_email: string
  └── client_phone: string
```

#### 2. **invoice** table
```sql
CREATE TABLE `invoice` (
  `invoice_id` int(11) NOT NULL,
  `invoice_number` varchar(255) NOT NULL,
  `client_id` int(11) NOT NULL,
  `invoice_date` date NOT NULL,
  `invoice_amount` decimal(10,2) NOT NULL,
  ...
)
```

**Firebase Firestore Structure:**
```
/invoices/{invoice_id}
  ├── invoice_id: number
  ├── invoice_number: string
  ├── client_id: number (reference to /clients/{client_id})
  ├── invoice_date: timestamp
  ├── invoice_amount: number
  └── ...
```

#### 3. **product** table
```sql
CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_hsn_code` varchar(255) NOT NULL,
  `product_gst_rate` decimal(5,2) NOT NULL,
  ...
)
```

**Firebase Firestore Structure:**
```
/products/{product_id}
  ├── product_id: number
  ├── product_name: string
  ├── product_hsn_code: string
  ├── product_gst_rate: number
  └── ...
```

#### 4. **settings** table
```sql
CREATE TABLE `settings` (
  `setting_id` int(11) NOT NULL,
  `setting_name` varchar(255) NOT NULL,
  `setting_value` text NOT NULL
)
```

**Firebase Firestore Structure:**
```
/settings/{setting_id}
  ├── setting_id: number
  ├── setting_name: string
  └── setting_value: string
```

---

## Approach 3: Automated SQL to JSON Conversion Script

Use this Python script to convert your SQL dump to Firebase-compatible JSON:

### Prerequisites:
```bash
pip install mysql-connector-python
```

### Script: `sql_to_firebase.py`
```python
import json
import re
from datetime import datetime

def parse_sql_dump(sql_file_path):
    """Parse SQL dump and extract data"""
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    tables = {}
    
    # Extract INSERT statements
    insert_pattern = r"INSERT INTO `(\w+)` \((.*?)\) VALUES\s*(.*?)(?=;)"
    matches = re.findall(insert_pattern, content, re.DOTALL)
    
    for table_name, columns, values in matches:
        column_list = [col.strip().strip('`') for col in columns.split(',')]
        tables[table_name] = {
            'columns': column_list,
            'data': []
        }
        
        # Parse values
        value_pattern = r"\((.*?)\)(?:,\s*\(|;)"
        value_matches = re.findall(value_pattern, values, re.DOTALL)
        
        for value_set in value_matches:
            row = {}
            values_list = [v.strip() for v in value_set.split(',')]
            
            for col, val in zip(column_list, values_list):
                # Clean up value
                val = val.strip()
                if val.startswith("'") and val.endswith("'"):
                    val = val[1:-1]
                elif val == 'NULL':
                    val = None
                else:
                    try:
                        val = int(val)
                    except:
                        try:
                            val = float(val)
                        except:
                            pass
                
                row[col] = val
            
            tables[table_name]['data'].append(row)
    
    return tables

def convert_to_firestore_format(tables):
    """Convert to Firestore nested structure"""
    firestore_data = {}
    
    for table_name, table_data in tables.items():
        firestore_data[table_name] = {}
        
        for row in table_data['data']:
            # Use the first ID column as document ID
            doc_id = None
            for col in row:
                if 'id' in col.lower():
                    doc_id = str(row[col])
                    break
            
            if doc_id:
                firestore_data[table_name][doc_id] = row
    
    return firestore_data

def save_to_json(data, output_path):
    """Save to JSON file"""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved to {output_path}")

# Usage
if __name__ == "__main__":
    sql_file = "leagacy-php-code/invoice_app.sql"
    output_file = "firebase_data.json"
    
    print("Parsing SQL dump...")
    tables = parse_sql_dump(sql_file)
    
    print("Converting to Firestore format...")
    firestore_data = convert_to_firestore_format(tables)
    
    print("Saving to JSON...")
    save_to_json(firestore_data, output_file)
    
    print("\nConversion complete!")
    print(f"Tables found: {list(firestore_data.keys())}")
```

---

## Approach 4: Import JSON to Firebase Using Firebase CLI

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase init
```

### Step 2: Use Firestore Import Script
Create `import_to_firestore.js`:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importData(jsonFilePath) {
  const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  
  for (const [collectionName, documents] of Object.entries(data)) {
    console.log(`Importing ${collectionName}...`);
    
    for (const [docId, docData] of Object.entries(documents)) {
      await db.collection(collectionName).doc(docId).set(docData);
    }
    
    console.log(`✓ ${collectionName} imported`);
  }
  
  console.log('All data imported successfully!');
  process.exit(0);
}

importData('firebase_data.json').catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
```

### Step 3: Run Import
```bash
npm install firebase-admin
node import_to_firestore.js
```

---

## Approach 5: Direct Firebase Console Import

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Click **Start Collection**
5. Manually add documents (suitable for small datasets)

Or use the **Bulk Import** feature if available in your Firebase plan.

---

## Recommended Workflow

1. **Export your current MySQL data** to JSON format using the Python script above
2. **Validate the JSON** structure matches your Firestore design
3. **Use Firebase CLI** to import the data
4. **Test the data** in Firestore console
5. **Update your PHP code** to use Firebase SDK instead of MySQL

---

## Firebase SDK Integration (Next Steps)

Once data is in Firebase, update your PHP code to use:

```php
// Using Firebase PHP SDK
require 'vendor/autoload.php';

use Kreait\Firebase\Factory;

$factory = new Factory();
$database = $factory
    ->withServiceAccount('path/to/serviceAccountKey.json')
    ->createFirestore();

// Example: Get all clients
$clients = $database->collection('clients')->documents();

foreach ($clients as $client) {
    echo $client->data()['client_name'];
}
```

---

## Summary

| Approach | Best For | Difficulty |
|----------|----------|-----------|
| SQL Connector (Dataflow) | Large datasets, automated sync | Medium |
| JSON Conversion Script | Quick migration, full control | Low |
| Firebase CLI Import | Programmatic import, CI/CD | Medium |
| Manual Console Import | Small datasets, testing | Very Low |

**Recommended:** Use Approach 3 (Python script) + Approach 4 (Firebase CLI) for fastest migration.
