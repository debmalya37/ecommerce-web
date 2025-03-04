// app/api/offers/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Offer from "@/models/offerModel";

export async function GET() {
  try {
    await dbConnect();
    // Retrieve all offers sorted descending by cutoff (so highest cutoff comes first)
    const offers = await Offer.find({}).sort({ cutoff: -1 });
    return NextResponse.json({ success: true, offers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { cutoff, discountPercentage, description } = await req.json();
    if (typeof cutoff !== "number" || typeof discountPercentage !== "number") {
      return NextResponse.json(
        { success: false, error: "Cutoff and discountPercentage must be numbers." },
        { status: 400 }
      );
    }
    const offer = new Offer({ cutoff, discountPercentage, description });
    await offer.save();
    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
