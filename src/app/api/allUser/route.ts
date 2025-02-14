// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const users = await User.find({}).lean();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    );
  }
}
