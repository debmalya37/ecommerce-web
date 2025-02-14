// app/api/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, otp, newPassword, confirmPassword } = await req.json();

    // Validate that passwords match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if OTP and OTP expiration exist
    if (!user.otp || !user.otpExpires) {
      return NextResponse.json(
        { success: false, error: "No OTP request found. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if the provided OTP matches
    if (user.otp !== otp) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Check if the OTP has expired (10 minutes)
    const now = new Date();
    if (now > user.otpExpires) {
      return NextResponse.json(
        { success: false, error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // OTP is valid: update the user's password.
    // Assign the plain text new password so that the pre-save hook will hash it.
    user.password = newPassword;
    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
