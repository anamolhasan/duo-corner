import { NextResponse } from 'next/server';

const GOOGLE_SHEET_URL =
  'https://script.google.com/macros/s/AKfycbyRhXgy18iGITj89GjcnblmsTWBejfYbNgPEEquYwZtxqyWolXceVQFl-BM8iWmeTg/exec';

export async function GET() {
  try {
    const response = await fetch(
      `${GOOGLE_SHEET_URL}?action=get_products`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Google Sheet থেকে ডেটা আনা যায়নি।');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Products API GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      action: body.action || 'add_product', // add_product, update_product অথবা delete_product
      id: body.id || '',
      productName: body.productName || body.name || '',
      category: body.category || '',
      price: body.price || 0,
      stock: body.stock || 100,
      description: body.description || '',
      imageUrl1: body.imageUrl1 || '',
      imageUrl2: body.imageUrl2 || '',
      imageUrl3: body.imageUrl3 || '',
      imageUrl4: body.imageUrl4 || '',
      regularPrice: body.regularPrice || 999
    };

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Google Sheet-এ ডেটা পাঠানো যায়নি।');
    }

    const result = await response.json().catch(() => ({ success: true }));
    return NextResponse.json({
      success: true,
      message: 'Operation successful',
      result
    });
  } catch (error) {
    console.error('Products API POST error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'ডেটা সংরক্ষণ করা যায়নি।',
      },
      { status: 500 }
    );
  }
}