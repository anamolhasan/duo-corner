import { NextResponse } from 'next/server';

const GOOGLE_SHEET_URL =
  'https://script.google.com/macros/s/AKfycbyRhXgy18iGITj89GjcnblmsTWBejfYbNgPEEquYwZtxqyWolXceVQFl-BM8iWmeTg/exec';

function parseImages(product: any): string[] {
  // গুগল শিটের যেকোনো সম্ভাব্য ইমেজ কলামের নাম বা ফরম্যাট চেক করা
  let rawValues = [
    product['Image URL1'], product['image_url1'], product['imageUrl1'], product.image1,
    product['Image URL2'], product['image_url2'], product['imageUrl2'], product.image2,
    product['Image URL3'], product['image_url3'], product['imageUrl3'], product.image3,
    product['Image URL4'], product['image_url4'], product['imageUrl4'], product.image4,
    product.imageUrl, product.images, product.F, product['Image URL'], product.image
  ];

  let imagesList: string[] = [];

  rawValues.forEach((val) => {
    if (val) {
      if (typeof val === 'string') {
        val.split(',').forEach((img) => {
          let clean = img.trim();
          if (clean) {
            let formatted = /^https?:\/\//i.test(clean) ? clean : (clean.startsWith('/') ? clean : '/' + clean);
            if (!imagesList.includes(formatted)) {
              imagesList.push(formatted);
            }
          }
        });
      } else if (Array.isArray(val)) {
        val.forEach((img) => {
          let clean = String(img).trim();
          if (clean) {
            let formatted = /^https?:\/\//i.test(clean) ? clean : (clean.startsWith('/') ? clean : '/' + clean);
            if (!imagesList.includes(formatted)) {
              imagesList.push(formatted);
            }
          }
        });
      }
    }
  });

  if (imagesList.length === 0) {
    imagesList = ['/parl.jpg', '/parl1.jpg', '/parl2.jpg', '/parl3.jpg'];
  }

  return imagesList;
}

function normalizeProduct(product: any, index: number) {
  const images = parseImages(product);

  return {
    ...product,
    id: product.id || index + 1,
    name: product['Product Name'] || product.productName || product.Name || product.name || product.A || "Product",
    price: Number(product['Offer Price'] || product.offerPrice || product.price || product.Price || product.B || 799),
    regularPrice: Number(product['Regular Price'] || product.regularPrice || 999),
    category: product['Category'] || product.category || product.Category || product.C || "Couple Item",
    description: product['Description'] || product.description || product.Description || product.E || "এক্সক্লুসিভ প্রোডাক্ট।",
    images,
    image: images[0] ?? '/parl.jpg',
    imageUrl: images[0] ?? '/parl.jpg',
  };
}

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

    if (Array.isArray(data)) {
      // প্রতিটি রো বা প্রোডাক্টকে সঠিকভাবে নরমালাইজ করা হচ্ছে যাতে কোনো রো বাদ না পড়ে
      return NextResponse.json(data.map((item, index) => normalizeProduct(item, index)));
    }

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
      action: 'add_product',
      productName: body.productName || body.name || '',
      category: body.category || '',
      price: body.price || 0,
      stock: body.stock || 0,
      description: body.description || '',
      imageUrl1: body.imageUrl1 || body.imageUrl || '',
      imageUrl2: body.imageUrl2 || '',
      imageUrl3: body.imageUrl3 || '',
      imageUrl4: body.imageUrl4 || '',
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
      throw new Error('Google Sheet-এ প্রোডাক্ট পাঠানো যায়নি।');
    }

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
    });
  } catch (error) {
    console.error('Products API POST error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Product সংরক্ষণ করা যায়নি।',
      },
      { status: 500 }
    );
  }
}