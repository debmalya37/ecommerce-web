// app/api/offline-purchases/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OfflinePurchase from "@/models/offlinePurchase";
import CoinEarningRate from "@/models/coinEarningRate"; // Import the coin rate model

export async function GET() {
  try {
    await dbConnect();
    const offlinePurchases = await OfflinePurchase.find({}).sort({ createdAt: -1 });
    return NextResponse.json(offlinePurchases);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch offline purchases", details: error.message },
      { status: 500 }
    );
  }
}




export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, phone, address, amountPaid, dueAmount, dateOfPayment } = await req.json();

    // Validate required fields
    if (!name || !phone || !address || !amountPaid || !dateOfPayment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the current coin earning rate document.
    let rateDoc = await CoinEarningRate.findOne({});
    const coinRate = rateDoc ? rateDoc.rate : 50; // default to 50 if not found

    // Calculate the coins earned based on the amount paid.
    const coinsEarned = Math.floor(amountPaid / coinRate);

    // Create new offline purchase including the calculated coinsEarned
    const newOfflinePurchase = new OfflinePurchase({
      name,
      email,
      phone,
      address,
      amountPaid,
      dueAmount: dueAmount || 0,
      dateOfPayment: new Date(dateOfPayment),
      coinsEarned, // Save the computed coin earning here
    });
    await newOfflinePurchase.save();

    return NextResponse.json({ success: true, offlinePurchase: newOfflinePurchase });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to add offline purchase", details: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Offline purchase ID is required" }, { status: 400 });
    }
    await OfflinePurchase.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Offline purchase deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete offline purchase", details: error.message },
      { status: 500 }
    );
  }
}
