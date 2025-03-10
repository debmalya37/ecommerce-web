// app/api/phonepe-payment/route.ts
import axios from "axios";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

let salt_key = "b0bec23c-6a29-4ae3-9e70-a1f5a18da8c6";
let merchant_id = "M22KXVB5MOYOV";

export async function POST(request: Request) {
  try {
    // Extract query parameters from the URL:
    const url = new URL(request.url);
    const originalTotal = url.searchParams.get("originalTotal");
    const walletUsedQS = url.searchParams.get("walletUsed");
    const source = url.searchParams.get("source");
    const cartQS = url.searchParams.get("cart");
    const selectedProductQS = url.searchParams.get("selectedProduct");
    console.log("Additional data from query params:", { originalTotal, walletUsedQS, source, cartQS, selectedProductQS });

    // Read the JSON body
    const { amount, userDetails } = await request.json();
    const transactionId = "Tr-" + uuidv4().toString().slice(-6);

    // Prepare data payload for PhonePe API
    const data = {
      merchantId: merchant_id,
      merchantTransactionId: transactionId,
      name: userDetails.name,
      amount: Math.round(amount * 100),
      redirectUrl: `https://hiuri.in/api/status/${transactionId}`,
      redirectMode: "POST",
      callbackUrl: `https://hiuri.in/api/status/${transactionId}`,
      mobileNumber: userDetails.phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const stringToHash = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    const response = await axios(options);
    console.log("PhonePe response:", response.data);

    const redirect = response.data.data.instrumentResponse.redirectInfo.url;
    return NextResponse.json({ redirect, transactionId }, { headers: { "Cache-Control": "no-store" } });
  } catch (error: any) {
    console.error("Payment initiation error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Payment initiation failed", details: error.message },
      { status: 500 }
    );
  }
}
