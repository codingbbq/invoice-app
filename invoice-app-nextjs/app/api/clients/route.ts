import { NextRequest, NextResponse } from 'next/server';
import {
  addClient,
  updateClient,
  deleteClient,
  getClients,
  getClient,
  Client,
} from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const client = await getClient(id);
      if (!client) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(client);
    }

    const clients = await getClients();
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.client_name || !body.client_email || !body.client_phone || !body.client_gst_no || !body.client_address) {
      return NextResponse.json(
        { error: 'Missing required fields: client_name, client_email, client_phone, client_gst_no, client_address' },
        { status: 400 }
      );
    }

    const clientData: Client = {
      client_name: body.client_name,
      client_email: body.client_email,
      client_phone: body.client_phone,
      client_gst_no: body.client_gst_no,
      client_address: body.client_address,
    };

    const docRef = await addClient(clientData);
    return NextResponse.json(
      { id: docRef.id, ...clientData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
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
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    await updateClient(id, body);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
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
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    await deleteClient(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
