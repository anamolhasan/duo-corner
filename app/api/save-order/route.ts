import { NextResponse } from 'next/server';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyRhXgy18iGITj89GjcnblmsTWBejfYbNgPEEquYwZtxqyWolXceVQFl-BM8iWmeTg/exec";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // চেক করা হচ্ছে এটি কি নতুন প্রোডাক্ট আপলোড নাকি অর্ডার সেভ
    const actionType = body.productName ? "add_product" : "add_order";

    const payload = actionType === "add_product" ? {
      action: "add_product",
      productName: body.productName || "",
      category: body.category || "",
      regularPrice: body.regularPrice || 0,
      price: body.price || 0,
      stock: body.stock || 0,
      description: body.description || "",
      imageUrl: body.imageUrl || "",
      videoUrl: body.videoUrl || "/video.mp4",
      attributes: JSON.stringify(body.attributes || []) // স্পেসিফিকেশন অ্যারে বা JSON স্ট্রিং
    } : {
      action: "add_order",
      name: body.name || "",
      phone: body.phone || "",
      address: body.address || "",
      thana: body.thana || "",
      district: body.district || "",
      division: body.division || "",
      note: body.note || "",
      amount: body.amount || 0
    };

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const response = await fetch(`${GOOGLE_SHEET_URL}?action=get_products`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([]);
  }
}