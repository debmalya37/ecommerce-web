// app/api/reset-wallet-coins/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
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

    // Store current coins and current year before resetting
    const currentCoins = user.wallet.coins;
    const currentYear = new Date().getFullYear();

    // Initialize walletHistory if not present
    if (!user.walletHistory) {
      user.walletHistory = [];
    }

    // Push the current coins with the corresponding year into walletHistory
    user.walletHistory.push({ year: currentYear, coins: currentCoins });

    // Reset the wallet coins to 0
    user.wallet.coins = 0;

    // Save the updated user document
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Wallet coins reset successfully",
      newCoins: user.wallet.coins,
      walletHistory: user.walletHistory,
    });
  } catch (error: any) {
    console.error("Error resetting wallet coins:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
