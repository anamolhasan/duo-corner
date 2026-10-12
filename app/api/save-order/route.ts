import { NextResponse } from 'next/server';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyRhXgy18iGITj89GjcnblmsTWBejfYbNgPEEquYwZtxqyWolXceVQFl-BM8iWmeTg/exec";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_order",
        name: body.name || "",
        phone: body.phone || "",
        address: body.address || "",
        note: body.note || "",
        amount: body.amount || 0
      })
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