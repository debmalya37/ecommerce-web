// app/api/allOrders/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // Fetch all users, selecting only the fields needed for order management
    const users = await User.find({}, "fullName email orders").lean();
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Error fetching all orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch all orders", details: error.message },
      { status: 500 }
    );
  }
}
