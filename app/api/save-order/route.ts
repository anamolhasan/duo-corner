import { NextResponse } from 'next/server';

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyRhXgy18iGITj89GjcnblmsTWBejfYbNgPEEquYwZtxqyWolXceVQFl-BM8iWmeTg/exec';

// ১. GET: গুগল শিট থেকে রিয়েল-টাইম অর্ডার ফেচ করার GET রাউট
export async function GET() {
  try {
    const response = await fetch(GOOGLE_SHEET_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Google Sheet থেকে অর্ডার ডেটা আনা যায়নি।');
    }
    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Orders API GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// ২. POST: কাস্টমার অর্ডার সেভ করার POST রাউট
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Google Sheet-এ অর্ডার পাঠানো যায়নি।');
    }

    const result = await response.json().catch(() => ({ status: 'success' }));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Orders API POST error:', error);
    return NextResponse.json({ status: 'error', message: 'Order save failed' }, { status: 500 });
  }
}

// ৩. PUT: Steadfast কুরিয়ারে অর্ডার পাঠানো এবং গুগল শিটে স্ট্যাটাস আপডেট করা
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const API_KEY = "nhebmum6ll3aeirxkoa0djqscqckyjn3";
    const SECRET_KEY = "9clfsi0vrhrbzwupeojrymau";
    
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
      const consignmentIdNumber = result.consignment?.consignment_id || result.consignment_id || "OK";
      
      // কুরিয়ারে এন্ট্রি সফল হওয়ার পর গুগল শিটে স্ট্যাটাস 'Booked' এবং ট্র্যাকিং কোড সিঙ্ক করা
      try {
        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_order_status',
            phone: body.phone,
            status: 'Booked',
            trackingCode: consignmentIdNumber
          })
        });
      } catch (sheetErr) {
        console.error("Google sheet status update error:", sheetErr);
      }

      return NextResponse.json({
        success: true,
        consignmentId: consignmentIdNumber
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message || JSON.stringify(result)
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Steadfast API proxy error:", error);
    return NextResponse.json({ success: false, error: error.toString() }, { status: 500 });
  }
}