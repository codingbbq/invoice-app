import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings, Settings } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings || {
      name: '',
      address: '',
      phone: '',
      email: '',
      gstNumber: '',
      cstNumber: '',
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      {
        name: '',
        address: '',
        phone: '',
        email: '',
        gstNumber: '',
        cstNumber: '',
      },
      { status: 200 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.name || !body.email || !body.phone || !body.address) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone, address' },
        { status: 400 }
      );
    }

    const settingsData: Settings = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      gstNumber: body.gstNumber || '',
      cstNumber: body.cstNumber || '',
    };

    await updateSettings(settingsData);
    return NextResponse.json({ success: true, data: settingsData });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
