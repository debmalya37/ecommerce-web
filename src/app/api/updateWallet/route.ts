import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Ensure you have a DB connection utility
import User from "@/models/userModel"; // Update path as per your project structure

export async function POST(req: Request) {
  try {
    const { email, amountUsed } = await req.json();

    if (!email || amountUsed === undefined) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await dbConnect(); // Ensure database is connected

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.wallet.balance < amountUsed) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
    }

    // Deduct balance
    user.wallet.balance -= amountUsed;
    await user.save();

    return NextResponse.json({ success: true, newBalance: user.wallet.balance }, { status: 200 });
  } catch (error) {
    console.error("Error updating wallet balance:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
