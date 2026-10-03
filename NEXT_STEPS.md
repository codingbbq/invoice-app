# Next Steps - Install shadcn/ui Components

## What We've Done So Far
✅ Created all API routes (clients, products, invoices, settings)
✅ Created custom React Query hooks for data fetching
✅ Created QueryProvider component
✅ Started creating layout components (Header)

## What You Need to Do Now

### Step 1: Install shadcn/ui Button Component
Run this command in your terminal (make sure you're in the `invoice-app-nextjs` directory):

```bash
npx shadcn-ui@latest add button
```

When prompted, press Enter to accept defaults.

### Step 2: Install Other UI Components
After the button installs successfully, run these commands one by one:

```bash
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

### Step 3: Verify Installation
After all components are installed, you should see a new folder:
```
src/components/ui/
```

This folder will contain all the shadcn/ui components.

### Step 4: Update Root Layout
Once components are installed, we'll update `src/app/layout.tsx` to include the QueryClientProvider.

## Why This Matters
- shadcn/ui components are pre-built, accessible UI components built on Radix UI
- They're fully customizable with Tailwind CSS
- They provide a consistent, modern look for our invoice app
- They're mobile-responsive out of the box

## After Installation
Once you've installed all the components, let me know and we'll:
1. Update the root layout.tsx to wrap the app with QueryClientProvider
2. Create the remaining layout components
3. Build the page components for clients, products, and invoices
