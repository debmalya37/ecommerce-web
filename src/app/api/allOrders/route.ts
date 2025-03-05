// app/api/allOrders/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const users = await User.find({}, "fullName email orders").lean();
    return NextResponse.json(users, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store'
      }
    });
  } catch (error: any) {
    console.error("Error fetching all orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch all orders", details: error.message },
      { status: 500 }
    );
  }
}