import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";
import { headers } from "next/headers";
import sendPaymentEmail from "@/lib/sendEmail";

export async function POST(req:Request) {
  try {
    const data = await req.formData();
  console.log(data);
  const status = data.get("code");
  const merchantId = data.get("merchantId");
  const transactionId = data.get("transactionId");

  // Check for null and handle appropriately
  if (!transactionId || typeof transactionId !== 'string') {
    throw new Error("Transaction ID is missing or invalid.");
  }

    const keyIndex = 1;

    const string =
      `/pg/v1/status/${merchantId}/${transactionId}` + process.env.PHONEPE_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const options = {
      method: "GET",
      url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${transactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": `${merchantId}`,
      },
    };

    const response = await axios(options);

    if (response.data.success === true) {
      // Call sendPaymentEmail if the payment is successful
      const userDetails = {
        name: data.get("name"),
        phone: data.get("phone"),
        email: data.get("email"),
      };
      const productDetails = {
        productName: data.get("productName"),
        productPrice: data.get("productPrice"),
      };
      await sendPaymentEmail(userDetails, transactionId, productDetails);

      return NextResponse.redirect("https://hiuri.in/success", {
        status: 301,
      });
    } else {
      return NextResponse.redirect("https://hiuri.in/failure", {
        status: 301,
      });
    }
  } catch (error:any) {
    console.error(error);
    // Return error response
    return NextResponse.json(
      { error: "Payment check failed", details: error.message },
      { status: 500 }
    );
  }
}
