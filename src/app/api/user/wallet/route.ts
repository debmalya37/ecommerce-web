import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Ensure this function connects to MongoDB
import User from "@/models/userModel"; // Adjust based on your User model location

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email }).select("walletBalance");

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ balance: user.walletBalance || 0 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, amount } = await req.json();
    if (!email || typeof amount !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { walletBalance: amount } },
      { new: true }
    ); 

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, balance: user.walletBalance });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
