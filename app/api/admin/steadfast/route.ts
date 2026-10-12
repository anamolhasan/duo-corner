import { NextResponse } from 'next/server';

const STEADFAST_API_URL = "https://portal.packzy.com/api/v1/create_order";
const API_KEY = "nhebmum6ll3aeirxkoa0djqscqckyjn3";
const SECRET_KEY = "9clfsi0vrhrbzwupeojrymau";

export async function POST(request: Request) {
  try {
    const order = await request.json();

    // Steadfast এপিআই এর রিকোয়ারমেন্ট অনুযায়ী ডেটা ফরম্যাট তৈরি
    const payload = {
      invoice: order.orderId || `ORD-${Date.now()}`,
      recipient_name: order.customerName || order.name || "Customer",
      recipient_phone: order.customerPhone || order.phone || "",
      recipient_address: order.customerAddress || order.address || "Dhaka",
      cod_amount: Number(order.productPrice || order.amount || 0),
      note: order.note || "Duo Corner Order"
    };

    const response = await fetch(STEADFAST_API_URL, {
      method: "POST",
      headers: {
        "Api-Key": API_KEY,
        "Secret-Key": SECRET_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === 200 || result.success) {
      return NextResponse.json({ success: true, result });
    } else {
      return NextResponse.json({ success: false, message: result.message || "Steadfast এন্ট্রি ব্যর্থ হয়েছে" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}