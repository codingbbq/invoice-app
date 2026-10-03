# Implementation Steps - Phase 2

## Current Status
✅ API routes created (Clients, Products, Invoices, Settings)
✅ Custom hooks created (useClients, useProducts, useInvoices)
✅ QueryProvider component created
⏳ Layout components in progress

## Next Commands to Execute

### Step 1: Install shadcn/ui components
Run these commands in your terminal (in the invoice-app-nextjs directory):

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add card
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add alert
```

After running these, the lint errors will be resolved.

### Step 2: Update main layout.tsx
We need to wrap the app with QueryClientProvider and update the root layout.

### Step 3: Create remaining layout components
- Sidebar (optional, can use header navigation)
- Footer

### Step 4: Create page components
- Dashboard/Home page
- Clients list and form pages
- Products list and form pages
- Invoices list and creation page
- Settings page

