import axios from "axios";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

let salt_key = "b0bec23c-6a29-4ae3-9e70-a1f5a18da8c6";
let merchant_id = "M22KXVB5MOYOV";

export async function POST(request: Request) {
  try {
    const { amount, userDetails } = await request.json(); // Retaining the current userDetails logic
    const transactionId = "Tr-" + uuidv4().toString().slice(-6);

    // Prepare data payload for PhonePe API
    const data = {
      merchantId: merchant_id,
      merchantTransactionId: transactionId,
      name: userDetails.name, // Use userDetails for name
      amount: Math.round(amount * 100), // Convert to paisa
      redirectUrl: `http://localhost:3000/api/status?id=${transactionId}`,
      redirectMode: "POST",
      callbackUrl: `http://localhost:3000/api/status?id=${transactionId}`,
      mobileNumber: userDetails.phone, // Use userDetails for phone
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const prod_URL =
      "https://api.phonepe.com/apis/hermes/pg/v1/pay";

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

    // Await axios response
    const response = await axios(options);

    // Log and return the response data
    console.log(response.data);

    const redirect=response.data.data.instrumentResponse.redirectInfo.url;
  console.log(redirect);
  return NextResponse.json({ redirect }); // Return response as JSON


    
  } catch (error: any) {
    console.error("Payment initiation error:", error.response?.data || error.message);

    // Return error response
    return NextResponse.json(
      { error: "Payment initiation failed", details: error.message },
      { status: 500 }
    );
  }
}
