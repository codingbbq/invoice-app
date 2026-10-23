# Invoice App

## Background

This project began as a PHP-based invoicing application around 2017, built to handle the day-to-day workflow of creating invoices, maintaining clients, and managing products. That version served its purpose well at the time, but over the years the product requirements evolved.

As the app needed a faster UI, better maintainability, cleaner component reuse, and a smoother way to manage data, the codebase was modernized into a new stack built on Next.js and Firebase.

The current version keeps the same core business goal as the original PHP app:

- create invoices quickly
- manage clients and products
- generate printable invoice documents
- keep the workflow simple for business users

## Why the Move from PHP to Next.js + Firebase

The migration was done to improve both developer experience and product scalability.

- **Modern frontend architecture**
  - Next.js provides a structured React-based application model with routing, layouts, API routes, and strong TypeScript support.

- **Reusable UI system**
  - Shared UI components make the application easier to maintain and expand.

- **Faster product iteration**
  - Features like dashboard widgets, searchable lists, sorting, pagination, and reporting are easier to build in a component-driven frontend.

- **Managed backend infrastructure**
  - Firebase Firestore simplifies data storage and removes the need for maintaining a traditional PHP/MySQL hosting setup.

- **Better long-term maintainability**
  - TypeScript, React Query, and modular hooks make the app more predictable and easier to extend.

## Current Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS 4, shared UI components
- **State / Data fetching**: TanStack React Query
- **Database**: Firebase Firestore
- **Auth approach**: custom lightweight auth flow stored in local storage
- **Utilities**: Zod, React Hook Form, Zustand, jsPDF, html2canvas-pro, Lucide icons

## Core Features

- **Dashboard**
  - overview widgets and business summaries

- **Client Management**
  - create, update, list, search, and manage clients

- **Product Management**
  - maintain product catalog with pricing and HSN details

- **Invoice Management**
  - create invoices
  - search and sort invoices
  - paginate invoice listings
  - view invoice details
  - delete invoices

- **Settings**
  - maintain company details used in invoice output

- **PDF / Print Support**
  - generate printable invoice documents

## Project Structure

```text
app/
  api/         API routes for clients, products, invoices, settings
  clients/     Client pages
  invoices/    Invoice listing, creation, detail pages
  products/    Product pages
  settings/    Company settings
components/
  auth/        Route protection
  dashboard/   Dashboard UI blocks
  forms/       Form components
  invoice/     Invoice rendering templates
  ui/          Shared UI system
hooks/         Shared hooks for auth, data, search, sort, pagination
lib/           Firebase setup, Firestore helpers, auth utilities
```

## Data Model Overview

The app primarily works with the following entities:

- **Clients**
  - name, GST number, address, email, phone

- **Products**
  - product name, description, MRP, HSN code

- **Invoices**
  - invoice number
  - client reference
  - invoice date
  - line items
  - GST percentage
  - discount percentage
  - subtotal, CGST, SGST, total

- **Settings**
  - company profile information used in generated invoices

## Sample Firebase / Firestore JSON Structure

Use the following as a simple sample seed structure for Firebase data setup. It includes one example record for each main collection used by the app.

```json
{
  "users": [
    {
      "id": "user_001",
      "username": "admin",
      "password": "admin123",
      "email": "admin@example.com"
    }
  ],
  "clients": [
    {
      "id": "client_001",
      "client_name": "Acme Traders",
      "client_gst_no": "27ABCDE1234F1Z5",
      "client_address": "12 Market Road, Mumbai",
      "client_email": "accounts@acmetraders.com",
      "client_phone": "+91-9876543210",
      "isActive": true
    }
  ],
  "products": [
    {
      "id": "product_001",
      "product_name": "LED Panel Light",
      "product_description": "18W square LED panel light",
      "product_mrp": 850,
      "product_hsn_code": "9405",
      "isActive": true
    }
  ],
  "invoices": [
    {
      "id": "invoice_001",
      "invoiceNumber": 1001,
      "clientId": "client_001",
      "invoiceDate": "2026-10-01",
      "items": [
        {
          "productId": "product_001",
          "mrp": 850,
          "quantity": 2,
          "rate": 850,
          "totalCost": 1700
        }
      ],
      "gstPercentage": 18,
      "discountPercentage": 0,
      "subtotal": 1700,
      "cgst": 153,
      "sgst": 153,
      "total": 2006
    }
  ],
  "settings": [
    {
      "id": "company",
      "name": "Coding BBQ Pvt Ltd",
      "address": "221 Business Park, Pune",
      "phone": "+91-9988776655",
      "email": "hello@codingbbq.com",
      "gstNumber": "27AAECC1234M1Z2",
      "cstNumber": "CST123456"
    }
  ]
}
```

### Collection Notes

- **`users`**
  - used by the current custom login flow

- **`clients`**
  - stores billing party details

- **`products`**
  - stores product master data used in invoice creation

- **`invoices`**
  - stores invoice header values and item rows together

- **`settings`**
  - stores company information used for invoice output

### Firestore Shape in Practice

In Firestore, each top-level key above would typically be a collection, and each object inside the array would become a document inside that collection.

Example:

- `clients/client_001`
- `products/product_001`
- `invoices/invoice_001`
- `settings/company`
- `users/user_001`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root and add your Firebase project values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in the browser.

## Available Scripts

- `npm run dev`
  - start the local development server

- `npm run build`
  - create the production build

- `npm run start`
  - run the production build locally

- `npm run lint`
  - run ESLint

## How the App Works

### Frontend

The UI is built with the Next.js App Router and a shared component library. Common behaviors like sorting, searching, and pagination are handled by reusable hooks.

### Data Access

The app uses API routes under `app/api` and Firestore-backed helpers in `lib/firestore.ts`.

### Authentication

The current implementation uses a simple custom login flow backed by Firestore user records and local storage session persistence.

## Current Limitations

- **Authentication is basic**
  - the current auth flow is lightweight and suitable for internal/admin usage, but not hardened like a full Firebase Authentication setup.

- **Security can be improved further**
  - if this product is prepared for broader production use, authentication and Firestore security rules should be strengthened.

- **Reporting is a natural next step**
  - the current data model is well suited for revenue, GST, client, and month-wise reporting.

## Suggested Next Enhancements

- dedicated reports dashboard
- month-wise income and invoice analytics
- GST slab insights
- top clients and top products reports
- exportable CSV/PDF reporting
- stronger auth and permissions model

## Migration Summary

In short, this project represents the evolution of a practical PHP invoicing tool from around 2017 into a modern web application using Next.js and Firebase. The business purpose remains the same, but the implementation is now more scalable, maintainable, and ready for future reporting and dashboard enhancements.
