import { NextRequest, NextResponse } from 'next/server';
import {
  addInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoices,
  getInvoice,
  Invoice,
} from '@/lib/firestore';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const invoice = await getInvoice(id);
      if (!invoice) {
        return NextResponse.json(
          { error: 'Invoice not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(invoice);
    }

    const invoices = await getInvoices();
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (
      !body.clientId ||
      !body.invoiceDate ||
      !body.items ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        { error: 'Missing required fields: clientId, invoiceDate, items (non-empty array)' },
        { status: 400 }
      );
    }

    // Get next invoice number using transaction
    let invoiceNumber: number;
    try {
      invoiceNumber = await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, 'invoiceCounters', 'current');
        const counterSnap = await transaction.get(counterRef);

        let nextNumber = 1;
        if (counterSnap.exists()) {
          nextNumber = (counterSnap.data().value || 0) + 1;
        }

        transaction.set(counterRef, { value: nextNumber });
        return nextNumber;
      });
    } catch (error) {
      console.error('Error getting invoice number:', error);
      return NextResponse.json(
        { error: 'Failed to generate invoice number' },
        { status: 500 }
      );
    }

    const invoiceData: Invoice = {
      invoiceNumber,
      clientId: body.clientId,
      invoiceDate: body.invoiceDate,
      items: body.items,
      gstPercentage: body.gstPercentage || 0,
      discountPercentage: body.discountPercentage || 0,
      subtotal: body.subtotal || 0,
      cgst: body.cgst || 0,
      sgst: body.sgst || 0,
      total: body.total || 0,
      status: body.status || 'draft',
    };

    const docRef = await addInvoice(invoiceData);
    return NextResponse.json(
      { id: docRef.id, ...invoiceData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    await updateInvoice(id, body);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    await deleteInvoice(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}

// Get next invoice number
export async function PATCH(request: NextRequest) {
  try {
    const counterRef = doc(db, 'invoiceCounters', 'current');
    const counterSnap = await getDoc(counterRef);

    let nextNumber = 1;
    if (counterSnap.exists()) {
      nextNumber = (counterSnap.data().value || 0) + 1;
    }

    return NextResponse.json({ invoiceNumber: nextNumber });
  } catch (error) {
    console.error('Error getting next invoice number:', error);
    return NextResponse.json(
      { error: 'Failed to get next invoice number' },
      { status: 500 }
    );
  }
}
