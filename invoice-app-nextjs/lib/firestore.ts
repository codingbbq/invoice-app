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
  const querySnapshot = await getDocs(collection(db, 'clients'));
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
  const querySnapshot = await getDocs(collection(db, 'products'));
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
  const querySnapshot = await getDocs(collection(db, 'invoices'));
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