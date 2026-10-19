import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase/firestore';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
  Product,
} from '@/lib/firestore';

// Helper function to convert Firestore Timestamps to ISO strings
function normalizeProduct(product: any): any {
  return {
    ...product,
    createdAt: product.createdAt instanceof Timestamp ? product.createdAt.toDate().toISOString() : product.createdAt,
    updatedAt: product.updatedAt instanceof Timestamp ? product.updatedAt.toDate().toISOString() : product.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const product = await getProduct(id);
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(normalizeProduct(product));
    }

    const products = await getProducts();
    return NextResponse.json(products.map(normalizeProduct));
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support both field name formats (product_name and name, etc.)
    const productName = body.product_name || body.name;
    const productDescription = body.product_description || body.description;
    const productMrp = body.product_mrp || body.mrp;
    const productHsnCode = body.product_hsn_code || body.hsnCode;

    // Validation
    if (!productName || !productDescription || productMrp === undefined || !productHsnCode) {
      return NextResponse.json(
        { error: 'Missing required fields: product_name, product_description, product_mrp, product_hsn_code' },
        { status: 400 }
      );
    }

    const productData: Product = {
      product_name: productName,
      product_description: productDescription,
      product_mrp: parseFloat(productMrp),
      product_hsn_code: productHsnCode,
    };

    const docRef = await addProduct(productData);
    const now = Timestamp.now();
    const responseData = {
      id: docRef.id,
      product_name: productData.product_name,
      product_description: productData.product_description,
      product_mrp: productData.product_mrp,
      product_hsn_code: productData.product_hsn_code,
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    };
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
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
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Map field names to the database format if needed
    const updateData: any = {};
    if (body.product_name) updateData.product_name = body.product_name;
    if (body.name) updateData.product_name = body.name;
    if (body.product_description) updateData.product_description = body.product_description;
    if (body.description) updateData.product_description = body.description;
    if (body.product_mrp !== undefined) updateData.product_mrp = parseFloat(body.product_mrp);
    if (body.mrp !== undefined) updateData.product_mrp = parseFloat(body.mrp);
    if (body.product_hsn_code) updateData.product_hsn_code = body.product_hsn_code;
    if (body.hsnCode) updateData.product_hsn_code = body.hsnCode;
    
    await updateProduct(id, updateData);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
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
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await deleteProduct(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
