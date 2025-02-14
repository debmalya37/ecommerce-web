// app/api/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import sendOtpEmail from "@/lib/sendOtpEmail";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = await req.json();
    // Generate a 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Set OTP expiration to 10 minutes from now
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Find and update the user document with the OTP and its expiration
    const user = await User.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Send the OTP email
    await sendOtpEmail({ email, otp });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
