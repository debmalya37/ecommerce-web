import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";

export async function POST(req: Request) {
  try {
    await dbConnect(); // Ensure DB connection
    const { email, walletChange } = await req.json();

    if (!email || walletChange === undefined) {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    // Find user and update wallet balance
    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { "wallet.balance": walletChange, "wallet.coins": walletChange } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, newBalance: user.wallet.balance, newCoins: user.wallet.coins });
  } catch (error) {
    console.error("Error updating wallet:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
