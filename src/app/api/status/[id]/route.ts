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
      // Retrieve details from session storage
      const userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "{}");
      const source = sessionStorage.getItem("source");

      let products = [];
      let totalAmount = 0;

      if (source === "cart") {
        products = JSON.parse(sessionStorage.getItem("cart") || "[]");
        totalAmount = products.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        );
      } else if (source === "buy-now") {
        const product = JSON.parse(sessionStorage.getItem("selectedProduct") || "{}");
        products = [product];
        totalAmount = product.price * product.quantity || 0;
      }

      // Prepare email details
      const emailDetails = {
        userDetails,
        transactionId,
        products,
        totalAmount,
      };

      // Send email
      await sendPaymentEmail(emailDetails);

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
