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