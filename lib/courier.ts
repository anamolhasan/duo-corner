export async function placeOrderToSteadfast(orderData: {
  invoice: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  amountToCollect: number;
}) {
  try {
    const response = await fetch(
      "https://portal.packzy.com/api/v1/create_order",
      {
        method: "POST",
        headers: {
          "Api-Key": process.env.STEADFAST_API_KEY!,
          "Secret-Key": process.env.STEADFAST_SECRET_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoice: orderData.invoice,
          recipient_name: orderData.recipientName,
          recipient_phone: orderData.recipientPhone,
          recipient_address: orderData.recipientAddress,
          cod_amount: orderData.amountToCollect,
          note: "Website Order",
        }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      throw { response: { data }, message: response.statusText };
    }
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Courier API Error:", error.response?.data || error.message);
    throw new Error("Failed to place order in courier");
  }
}
