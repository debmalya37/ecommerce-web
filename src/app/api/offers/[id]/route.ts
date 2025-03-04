// app/api/offers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Offer from "@/models/offerModel";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Offer ID is required" },
        { status: 400 }
      );
    }
    await Offer.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Offer deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
