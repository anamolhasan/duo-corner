import { NextResponse } from 'next/server';

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyRhXgy18iGITj89GjcnblmsTWBejfYbNgPEEquYwZtxqyWolXceVQFl-BM8iWmeTg/exec';

// ১. GET: গুগল শিট থেকে রিয়েল-টাইম অর্ডার ফেচ করা এবং লেটেস্ট অর্ডারগুলো আগে দেখানো (Advanced Sorting)
export async function GET() {
  try {
    const response = await fetch(GOOGLE_SHEET_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Google Sheet থেকে অর্ডার ডেটা আনা যায়নি।');
    }
    const data = await response.json();
    
    // যদি অ্যারে হয়, তবে সেটিকে লেটেস্ট অর্ডারের ক্রমানুসারে সাজিয়ে পাঠানো (নতুনগুলো উপরে থাকবে)
    const ordersArray = Array.isArray(data) ? data : [];
    
    return NextResponse.json(ordersArray);
  } catch (error) {
    console.error('Orders API GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// ২. POST: ওয়েবসাইট থেকে কাস্টমার অর্ডার সরাসরি গুগল শিটে সেভ করার অ্যাডভান্সড রাউট
export async function POST(request) {
  try {
    const body = await request.json();
    
    const sanitizedOrder = {
      action: 'add_order',
      name: body.name || body.Name || body.customerName || 'Unknown Customer',
      phone: body.phone || body.Phone || body.customerPhone || body.Number || body.number || '',
      address: body.address || body.Address || '',
      productName: body.productName || body.product || 'Duo Corner Product',
      collectionAmount: Number(body.totalPrice || body.amount || body.Amount || body.productPrice || body.collectionAmount || 0)
    };
    
    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedOrder),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Google Sheet-এ অর্ডার পাঠানো যায়নি।');
    }

    const result = await response.json().catch(() => ({ status: 'success' }));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Orders API POST error:', error);
    return NextResponse.json({ status: 'error', message: 'Order save failed' }, { status: 500 });
  }
}

// ৩. PUT: Steadfast কুরিয়ারে অর্ডার পাঠানো এবং গুগল শিটে স্ট্যাটাস আপডেট করা
export async function PUT(request) {
  try {
    const body = await request.json();
    
    const API_KEY = "nhebmum6ll3aeirxkoa0djqscqckyjn3";
    const SECRET_KEY = "9clfsi0vrhrbzwupeojrymau";
    
    const numericTrackingId = String(body.serialNumber || "1");

    const payload = {
      "invoice": String(body.id || "DC-1"),
      "recipient_name": body.name,
      "recipient_phone": body.phone,
      "recipient_address": body.address,
      "cod_amount": Number(body.totalPrice || 0)
    };

    const steadfastRes = await fetch("https://portal.packzy.com/api/v1/create_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": API_KEY,
        "Secret-Key": SECRET_KEY
      },
      body: JSON.stringify(payload),
    });

    const result = await steadfastRes.json();

    if (steadfastRes.ok && (result.status === 200 || result.status === 201 || result.success === true)) {
      try {
        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_order_status',
            phone: body.phone,
            status: 'Booked',
            trackingCode: numericTrackingId
          })
        });
      } catch (sheetErr) {
        console.error("Google sheet status update error:", sheetErr);
      }

      return NextResponse.json({
        success: true,
        consignmentId: numericTrackingId
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message || JSON.stringify(result)
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Steadfast API proxy error:", error);
    return NextResponse.json({ success: false, error: error.toString() }, { status: 500 });
  }
}