// app/api/add-transaction/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, transactionId, amount, products } = await req.json();

    if (!email || !transactionId || typeof amount !== "number") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const transaction = {
      transactionId,
      amount,
      products, // expects an array of strings (e.g., product names)
      date: new Date(),
    };

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $push: { transactions: transaction } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Error adding transaction:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
