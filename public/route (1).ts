import { NextResponse } from 'next/server';

const GOOGLE_SHEET_URL =
  'https://script.google.com/macros/s/AKfycbyRhXgy18iGITj89GjcnblmsTWBejfYbNgPEEquYwZtxqyWolXceVQFl-BM8iWmeTg/exec';

function imageValue(value: unknown): string {
  return String(value ?? '').trim();
}

function normalizeProduct(product: any) {
  const imageColumns = [
    product?.['Image URL1'],
    product?.['Image URL2'],
    product?.['Image URL3'],
    product?.['Image URL4'],
    // Spaces in header are also supported
    product?.['Image URL 1'],
    product?.['Image URL 2'],
    product?.['Image URL 3'],
    product?.['Image URL 4'],
  ];

  let images = imageColumns.map(imageValue).filter(Boolean);

  // Backward compatibility for the old single-column/comma-separated format
  if (images.length === 0) {
    const oldValue = product?.images ?? product?.image ?? product?.['Image URL'] ?? product?.imageUrl ?? product?.F ?? '';
    images = (Array.isArray(oldValue) ? oldValue : String(oldValue).split(','))
      .flatMap((item: unknown) => String(item ?? '').split(','))
      .map(imageValue)
      .filter(Boolean);
  }

  // Keep remote image URLs intact; prefix local public filenames with '/'
  images = images.map((image) =>
    /^https?:\/\//i.test(image) ? image : `/${image.replace(/^\/+/, '')}`
  );

  return {
    ...product,
    images,
    image: images[0] ?? '',
    imageUrl: images[0] ?? '',
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_product',
        productName: body.productName || '',
        category: body.category || '',
        price: body.price || 0,
        stock: body.stock || 0,
        description: body.description || '',
        imageUrl: body.imageUrl || '',
        imageUrl1: body.imageUrl1 || body['Image URL1'] || '',
        imageUrl2: body.imageUrl2 || body['Image URL2'] || '',
        imageUrl3: body.imageUrl3 || body['Image URL3'] || '',
        imageUrl4: body.imageUrl4 || body['Image URL4'] || '',
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Google Sheet-এ প্রোডাক্ট পাঠানো যায়নি।');
    }

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const response = await fetch(`${GOOGLE_SHEET_URL}?action=get_products`, {
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('Google Sheet থেকে প্রোডাক্ট আনা যায়নি।');

    const data = await response.json();

    if (Array.isArray(data)) {
      return NextResponse.json(data.map(normalizeProduct));
    }

    if (data && typeof data === 'object') {
      for (const key of ['products', 'data', 'items']) {
        if (Array.isArray(data[key])) {
          return NextResponse.json({
            ...data,
            [key]: data[key].map(normalizeProduct),
          });
        }
      }

      if (
        data['Image URL1'] !== undefined ||
        data['Image URL2'] !== undefined ||
        data['Image URL3'] !== undefined ||
        data['Image URL4'] !== undefined ||
        data.imageUrl !== undefined ||
        data.images !== undefined
      ) {
        return NextResponse.json(normalizeProduct(data));
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, message: 'প্রোডাক্ট লোড করা যায়নি।' },
      { status: 500 }
    );
  }
}
