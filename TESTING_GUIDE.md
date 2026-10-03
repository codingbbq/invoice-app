# Testing Guide - Invoice App

## What We've Built

### ✅ Completed Components
1. **API Routes** - Full CRUD operations for Clients, Products, Invoices, Settings
2. **Custom Hooks** - React Query hooks for data fetching and mutations
3. **Layout Components** - Header with mobile navigation, Footer
4. **Dashboard** - Home page with statistics and recent invoices
5. **Clients Management** - List, Add, Edit clients
6. **Products Management** - List, Add, Edit products
7. **Invoice Creation** - Full invoice form with:
   - Client selection
   - Product selection with dynamic pricing
   - Quantity and rate input
   - Real-time GST calculation (CGST/SGST split)
   - Discount percentage support
   - Add/Remove line items
8. **Invoice Viewing** - View invoice details with PDF download
9. **Settings** - Company information management

---

## Testing Steps

### Step 1: Start the Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser. You should see the dashboard.

### Step 2: Test Settings (Do This First!)
1. Go to **Settings** page (http://localhost:3000/settings)
2. Fill in company information:
   - Company Name: Your Company
   - Email: company@example.com
   - Phone: 9876543210
   - Address: Your Address
   - GST Number: 18AABCT1234H1Z0
   - CST Number: (optional)
3. Click "Save Settings"
4. Verify the data is saved (refresh page, data should persist)

### Step 3: Add Products
1. Go to **Products** page (http://localhost:3000/products)
2. Click "Add Product"
3. Fill in product details:
   - Product Name: Laptop
   - HSN Code: 8471
   - MRP: 50000
   - Description: High-performance laptop
4. Click "Add Product"
5. Verify product appears in the list
6. Add 2-3 more products for testing

### Step 4: Add Clients
1. Go to **Clients** page (http://localhost:3000/clients)
2. Click "Add Client"
3. Fill in client details:
   - Client Name: ABC Corporation
   - GST Number: 27AABCT1234H1Z0
   - Email: abc@example.com
   - Phone: 9876543210
   - Address: Mumbai, India
4. Click "Add Client"
5. Verify client appears in the list
6. Add 2-3 more clients for testing

### Step 5: Create an Invoice
1. Go to **Invoices** page (http://localhost:3000/invoices)
2. Click "Create Invoice"
3. Fill in invoice details:
   - Invoice Date: Today's date
   - Client: Select one of your clients
   - GST: 18%
4. Add products:
   - Click on Product dropdown, select a product
   - Quantity: 2
   - Rate: Should auto-fill with MRP (can change)
   - Click "Add Item" to add more products
5. Verify calculations:
   - Subtotal = Sum of (Quantity × Rate) for all items
   - CGST = (Subtotal × 9%)
   - SGST = (Subtotal × 9%)
   - Total = Subtotal + CGST + SGST
6. Test discount:
   - Enter Discount %: 10
   - Verify total recalculates correctly
7. Click "Create Invoice"
8. Verify invoice appears in the invoices list

### Step 6: View Invoice and Download PDF
1. From invoices list, click "View" on your created invoice
2. Verify all details are displayed correctly
3. Click "Download PDF"
4. Verify PDF downloads successfully
5. Open PDF and verify formatting

### Step 7: Test Edit/Delete Operations
1. **Edit Client**: Go to Clients, click Edit, modify details, save
2. **Delete Client**: Go to Clients, click Delete, confirm deletion
3. **Edit Product**: Go to Products, click Edit, modify details, save
4. **Delete Product**: Go to Products, click Delete, confirm deletion

### Step 8: Test Dashboard
1. Go to Dashboard (http://localhost:3000)
2. Verify statistics display:
   - Total Invoices count
   - Total Clients count
   - Total Products count
   - Total Revenue (sum of all invoice totals)
3. Verify recent invoices table shows latest invoices

### Step 9: Test Mobile Responsiveness
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px)
4. Verify:
   - Header navigation collapses to mobile menu
   - Tables are scrollable on mobile
   - Forms are readable on all sizes
   - Buttons are touch-friendly

---

## Expected Behavior

### Calculations
For an invoice with:
- Product 1: Qty 2, Rate 1000 = 2000
- Product 2: Qty 1, Rate 500 = 500
- Subtotal: 2500
- GST (18%): 450 (CGST 225 + SGST 225)
- Total: 2950

With 10% discount:
- Subtotal: 2500
- Discount: 250
- After Discount: 2250
- GST (18%): 405 (CGST 202.50 + SGST 202.50)
- Total: 2655

### Data Persistence
- All data should persist in Firestore
- Refresh page should load data from database
- Multiple browser tabs should sync data

---

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution**: Ensure all dependencies are installed
```bash
npm install
```

### Issue: Firestore connection errors
**Solution**: 
1. Verify `.env.local` has correct Firebase credentials
2. Check Firestore database is created in Firebase Console
3. Restart dev server: `npm run dev`

### Issue: PDF download not working
**Solution**: 
1. Check browser console for errors
2. Ensure html2pdf.js is installed: `npm list html2pdf.js`
3. Try different browser

### Issue: Data not saving
**Solution**:
1. Check browser console for API errors
2. Verify Firestore security rules allow read/write
3. Check network tab in DevTools for failed requests

---

## Next Steps After Testing

If all tests pass:
1. Create initial data migration from MySQL to Firestore
2. Setup production deployment (Vercel or Firebase Hosting)
3. Configure custom domain
4. Setup monitoring and logging
5. Create user documentation

