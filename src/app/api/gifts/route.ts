import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Gift from "@/models/giftModel";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const recipientEmail = searchParams.get("recipientEmail");
    const gifts = recipientEmail
      ? await Gift.find({ recipientEmail })
      : await Gift.find({});
    return NextResponse.json({ success: true, gifts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { recipientEmail, recipientName, giftDetails } = await req.json();
    if (!recipientEmail || !recipientName || !giftDetails) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    const gift = new Gift({
      recipientEmail,
      recipientName,
      giftDetails,
      status: "Sent"
    });
    await gift.save();
    return NextResponse.json({ success: true, gift });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Optional: PATCH endpoint to update gift status (e.g., cancel a gift)
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { giftId, status } = await req.json();
    if (!giftId || !status) {
      return NextResponse.json(
        { success: false, error: "giftId and status are required" },
        { status: 400 }
      );
    }
    const gift = await Gift.findByIdAndUpdate(giftId, { status }, { new: true });
    if (!gift) {
      return NextResponse.json({ success: false, error: "Gift not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, gift });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
