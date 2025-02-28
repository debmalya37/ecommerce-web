import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";
import { headers } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";


export async function POST(req:Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const totalAmount = Number(searchParams.get("totalAmount"));
    const productsStr = searchParams.get("products");
    const products = productsStr ? JSON.parse(productsStr) : [];
    const data = await req.formData();
  console.log(data);
  const status = data.get("code");
  const merchantId = data.get("merchantId");
  const transactionId = data.get("transactionId");
  if (!transactionId) {
    throw new Error("Transaction ID is missing");
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
        // If payment is successful, update the user's orders
        if (email) {
          await dbConnect();
          const order = {
            orderId: transactionId.toString(),
            totalAmount,
            status: "Placed",
            placedAt: new Date(),
            products, // expecting an array of product names or IDs
          };
          await User.findOneAndUpdate(
            { email },
            { $push: { orders: order } }
          );
        }
      
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
