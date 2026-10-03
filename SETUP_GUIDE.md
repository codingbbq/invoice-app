# Invoice App - Step-by-Step Setup Guide

## Prerequisites
Before starting, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- A Firebase account (free tier available)
- A code editor (VS Code recommended)

---

## STEP 1: Create Next.js Project

### Command to Execute:
```bash
npx create-next-app@latest invoice-app-nextjs --typescript --tailwind --eslint
```

### When prompted, answer:
```
✔ Would you like to use TypeScript? › Yes
✔ Would you like to use ESLint? › Yes
✔ Would you like to use Tailwind CSS? › Yes
✔ Would you like your code inside a `src/` directory? › Yes
✔ Would you like to use App Router? › Yes
✔ Would you like to use Turbopack for next dev? › No
✔ Would you like to customize the import alias? › No
```

### After completion:
```bash
cd invoice-app-nextjs
```

---

## STEP 2: Install Required Dependencies

### Command to Execute:
```bash
npm install firebase firebase-admin react-hook-form @tanstack/react-query zustand date-fns clsx zod jspdf html2pdf.js lucide-react
```

### Install shadcn/ui components:
```bash
npx shadcn@latest init
```

When prompted:
```
✔ Would you like to use TypeScript (recommended)? › Yes
✔ Which style would you like to use? › Default
✔ Which color would you like as the base color? › Slate
✔ Where is your global CSS file? › src/app/globals.css
```

### Add specific shadcn/ui components:
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add toast
npx shadcn@latest add card
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add alert
```

---

## STEP 3: Setup Firebase Project

### In Firebase Console:
1. Go to https://console.firebase.google.com
2. Click "Create a project"
3. Name it: `invoice-app-nextjs`
4. Disable Google Analytics (optional)
5. Click "Create project"
6. Wait for project creation to complete

### Enable Firestore Database:
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select region: `asia-south1` (India) or your preferred region
4. Start in "Production mode"
5. Click "Create"

### Get Firebase Config:
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" icon to create web app
4. Register app name: `invoice-app`
5. Copy the Firebase config object (you'll need this)

---

## STEP 4: Create Environment Variables

### Command to Execute:
Create a file `.env.local` in your project root:

```bash
# Windows (PowerShell)
New-Item -Path .env.local -ItemType File

# Or create it manually in your editor
```

### Add these contents to `.env.local`:
```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

Replace the values with your Firebase config from Step 3.

---

## STEP 5: Create Project Structure

### Commands to Execute:
```bash
# Create directories
mkdir -p src/components/layout
mkdir -p src/components/forms
mkdir -p src/components/tables
mkdir -p src/components/modals
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/store
mkdir -p src/app/api/clients
mkdir -p src/app/api/products
mkdir -p src/app/api/invoices
mkdir -p src/app/api/settings
mkdir -p "src/app/(dashboard)/clients"
mkdir -p "src/app/(dashboard)/products"
mkdir -p "src/app/(dashboard)/invoices"
mkdir -p "src/app/(dashboard)/settings"
mkdir -p scripts
```

---

## STEP 6: Create Firebase Configuration Files

### Create `src/lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### Create `src/lib/firestore.ts`:
```typescript
import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

// Type definitions
export interface Client {
  id?: string;
  name: string;
  gstNo: string;
  address: string;
  email: string;
  phone: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  isActive?: boolean;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  mrp: number;
  hsnCode: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  isActive?: boolean;
}

export interface InvoiceItem {
  productId: string;
  mrp: number;
  quantity: number;
  rate: number;
  totalCost: number;
}

export interface Invoice {
  id?: string;
  invoiceNumber: number;
  clientId: string;
  invoiceDate: string;
  items: InvoiceItem[];
  gstPercentage: number;
  discountPercentage: number;
  subtotal: number;
  cgst: number;
  sgst: number;
  total: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  status: 'draft' | 'finalized';
}

export interface Settings {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstNumber: string;
  cstNumber: string;
  updatedAt?: Timestamp;
}

// Client operations
export const addClient = async (client: Client) => {
  return await addDoc(collection(db, 'clients'), {
    ...client,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isActive: true,
  });
};

export const updateClient = async (id: string, client: Partial<Client>) => {
  return await updateDoc(doc(db, 'clients', id), {
    ...client,
    updatedAt: Timestamp.now(),
  });
};

export const deleteClient = async (id: string) => {
  return await deleteDoc(doc(db, 'clients', id));
};

export const getClients = async () => {
  const querySnapshot = await getDocs(
    query(collection(db, 'clients'), where('isActive', '==', true))
  );
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Client & { id: string })[];
};

export const getClient = async (id: string) => {
  const docSnap = await getDoc(doc(db, 'clients', id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Product operations
export const addProduct = async (product: Product) => {
  return await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isActive: true,
  });
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  return await updateDoc(doc(db, 'products', id), {
    ...product,
    updatedAt: Timestamp.now(),
  });
};

export const deleteProduct = async (id: string) => {
  return await deleteDoc(doc(db, 'products', id));
};

export const getProducts = async () => {
  const querySnapshot = await getDocs(
    query(collection(db, 'products'), where('isActive', '==', true))
  );
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Product & { id: string })[];
};

export const getProduct = async (id: string) => {
  const docSnap = await getDoc(doc(db, 'products', id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Invoice operations
export const addInvoice = async (invoice: Invoice) => {
  return await addDoc(collection(db, 'invoices'), {
    ...invoice,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const updateInvoice = async (id: string, invoice: Partial<Invoice>) => {
  return await updateDoc(doc(db, 'invoices', id), {
    ...invoice,
    updatedAt: Timestamp.now(),
  });
};

export const deleteInvoice = async (id: string) => {
  return await deleteDoc(doc(db, 'invoices', id));
};

export const getInvoices = async () => {
  const querySnapshot = await getDocs(
    query(collection(db, 'invoices'), orderBy('createdAt', 'desc'))
  );
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Invoice & { id: string })[];
};

export const getInvoice = async (id: string) => {
  const docSnap = await getDoc(doc(db, 'invoices', id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Settings operations
export const getSettings = async () => {
  const docSnap = await getDoc(doc(db, 'settings', 'company'));
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateSettings = async (settings: Settings) => {
  return await updateDoc(doc(db, 'settings', 'company'), {
    ...settings,
    updatedAt: Timestamp.now(),
  });
};
```

---

## STEP 7: Create Type Definitions

### Create `src/types/index.ts`:
```typescript
import { Timestamp } from 'firebase/firestore';

export interface Client {
  id: string;
  name: string;
  gstNo: string;
  address: string;
  email: string;
  phone: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  hsnCode: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

export interface InvoiceItem {
  productId: string;
  mrp: number;
  quantity: number;
  rate: number;
  totalCost: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: number;
  clientId: string;
  invoiceDate: string;
  items: InvoiceItem[];
  gstPercentage: number;
  discountPercentage: number;
  subtotal: number;
  cgst: number;
  sgst: number;
  total: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'draft' | 'finalized';
}

export interface Settings {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstNumber: string;
  cstNumber: string;
  updatedAt: Timestamp;
}
```

---

## STEP 8: Test Your Setup

### Command to Execute:
```bash
npm run dev
```

This will start the development server at `http://localhost:3000`

### What to verify:
- ✅ Server starts without errors
- ✅ Can access http://localhost:3000
- ✅ No Firebase connection errors in console

---

## Next Steps After Setup

Once you complete these 8 steps, we'll proceed with:
1. Creating the data migration script
2. Building API routes
3. Creating UI components
4. Building pages (clients, products, invoices)
5. Implementing invoice creation with GST calculations
6. PDF generation
7. Mobile-responsive design refinement

---

## Troubleshooting

**Issue: Firebase config not loading**
- Verify `.env.local` file exists in project root
- Check all environment variable names match exactly
- Restart dev server after adding env variables

**Issue: Firestore connection errors**
- Ensure Firestore database is created in Firebase Console
- Check Firebase project ID matches in `.env.local`
- Verify Firestore security rules allow read/write

**Issue: Node modules installation fails**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

