const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyRhXgy18iGITj89GjcnblmsTWBejfYbNgPEEquYwZtxqyWolXceVQFl-BM8iWmeTg/exec";

// ১. GET: Google Sheet থেকে অর্ডার এনে নতুন সিরিয়াল আগে দেখানো
export async function GET() {
  try {
    const response = await fetch(GOOGLE_SHEET_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Google Sheet থেকে অর্ডার ডেটা আনা যায়নি।");
    }

    const data = await response.json();
    const orders = Array.isArray(data) ? data : [];

    orders.sort((a: { orderId?: unknown }, b: { orderId?: unknown }) => {
      const getOrderNumber = (orderId: unknown): number => {
        const match = String(orderId ?? "").match(/^ORD-(\d+)$/i);
        return match ? Number(match[1]) : -1;
      };

      return getOrderNumber(b.orderId) - getOrderNumber(a.orderId);
    });

    return Response.json(orders);
  } catch (error) {
    console.error("Orders API GET error:", error);

    return Response.json([], { status: 500 });
  }
}

// ২. POST: ওয়েবসাইট থেকে নতুন অর্ডার Google Sheet-এ পাঠানো
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sanitizedOrder = {
      action: "add_order",
      name: body.name || body.Name || body.customerName || "Unknown Customer",

      phone:
        body.phone ||
        body.Phone ||
        body.customerPhone ||
        body.Number ||
        body.number ||
        "",

      address: body.address || body.Address || "",

      collectionAmount: Number(
        body.totalPrice ||
          body.amount ||
          body.Amount ||
          body.productPrice ||
          body.collectionAmount ||
          0,
      ),
    };

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitizedOrder),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Google Sheet-এ অর্ডার পাঠানো যায়নি।");
    }

    const result = await response.json().catch(() => ({
      status: "success",
    }));

    if (result.status === "error") {
      return Response.json(
        {
          status: "error",
          message: result.message || "Order save failed",
        },
        { status: 500 },
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("Orders API POST error:", error);

    return Response.json(
      {
        status: "error",
        message: "Order save failed",
      },
      { status: 500 },
    );
  }
}

// ৩. PUT: Steadfast-এ অর্ডার পাঠানো ও Google Sheet আপডেট
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const env = (
      globalThis as typeof globalThis & {
        process?: { env?: Record<string, string | undefined> };
      }
    ).process?.env;
    const API_KEY = env?.STEADFAST_API_KEY;
    const SECRET_KEY = env?.STEADFAST_SECRET_KEY;

    if (!API_KEY || !SECRET_KEY) {
      return Response.json(
        {
          success: false,
          error: "Steadfast API credentials are not configured.",
        },
        { status: 500 },
      );
    }

    const numericTrackingId = String(body.serialNumber || "1");

    const payload = {
      invoice: String(body.id || "DC-1"),
      recipient_name: body.name,
      recipient_phone: body.phone,
      recipient_address: body.address,
      cod_amount: Number(body.totalPrice || 0),
    };

    const steadfastRes = await fetch(
      "https://portal.packzy.com/api/v1/create_order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": API_KEY,
          "Secret-Key": SECRET_KEY,
        },
        body: JSON.stringify(payload),
      },
    );

    const result = await steadfastRes.json();

    if (
      steadfastRes.ok &&
      (result.status === 200 ||
        result.status === 201 ||
        result.success === true)
    ) {
      try {
        await fetch(GOOGLE_SHEET_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "update_order_status",
            phone: body.phone,
            status: "Booked",
            trackingCode: numericTrackingId,
          }),
        });
      } catch (sheetErr) {
        console.error("Google sheet status update error:", sheetErr);
      }

      return Response.json({
        success: true,
        consignmentId: numericTrackingId,
      });
    }

    return Response.json(
      {
        success: false,
        error: result.message || JSON.stringify(result),
      },
      { status: 400 },
    );
  } catch (error: unknown) {
    console.error("Steadfast API proxy error:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
