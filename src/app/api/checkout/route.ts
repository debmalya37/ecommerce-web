import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  const { email, walletUsed, totalAmount } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Check if user has enough wallet balance
  if (walletUsed > user.wallet.coins) {
    return NextResponse.json({ error: "Not enough wallet coins" }, { status: 400 });
  }

  // Deduct wallet balance
  user.wallet.coins -= walletUsed;
  const amountToPay = totalAmount - walletUsed;

  // Clear user's cart
  user.cart = [];
  await user.save();

  return NextResponse.json({
    success: true,
    amountToPay,
  });
}
