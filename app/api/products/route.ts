import { NextResponse } from 'next/server';

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyRhXgy18iGITj89GjcnblmsTWBejfYbNgPEEquYwZtxqyWolXceVQFl-BM8iWmeTg/exec';

// GET: গুগল শিট বা ডেটাবেজ থেকে সকল প্রোডাক্ট ও ইনভেন্টরি ফেচ করা
export async function GET() {
  try {
    const response = await fetch(`${GOOGLE_SHEET_URL}?action=get_products`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Products fetch failed');
    }
    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Products API GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST: অ্যাডমিন প্যানেল থেকে নতুন প্রোডাক্ট এবং স্পেসিফিকেশন সহ ইনভেন্টরি সেভ করা
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_product',
        ...body
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Google Sheet product save failed');
    }

    const result = await response.json().catch(() => ({ status: 'success' }));
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Products API POST error:', error);
    return NextResponse.json({ success: false, error: error.toString() }, { status: 500 });
  }
}