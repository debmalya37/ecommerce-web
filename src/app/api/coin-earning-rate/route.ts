// app/api/coin-earning-rate/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CoinEarningRate from "@/models/coinEarningRate";

export async function GET() {
  try {
    await dbConnect();
    // Try to fetch the coin earning rate document.
    let rateDoc = await CoinEarningRate.findOne({});
    // If no document exists, create one with default value.
    if (!rateDoc) {
      rateDoc = await CoinEarningRate.create({ rate: 50 });
    }
    return NextResponse.json({ rate: rateDoc.rate });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch coin earning rate", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { rate } = await req.json();
    if (!rate || typeof rate !== "number" || rate <= 0) {
      return NextResponse.json(
        { error: "A valid coin earning rate is required" },
        { status: 400 }
      );
    }
    // Update the single document (or create if not exists)
    let rateDoc = await CoinEarningRate.findOne({});
    if (!rateDoc) {
      rateDoc = await CoinEarningRate.create({ rate });
    } else {
      rateDoc.rate = rate;
      await rateDoc.save();
    }
    return NextResponse.json({ success: true, rate: rateDoc.rate });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update coin earning rate", details: error.message },
      { status: 500 }
    );
  }
}
