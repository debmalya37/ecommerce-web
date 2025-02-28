// app/api/orders/[orderId]/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";

export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    await dbConnect();
    const { email } = await req.json(); // Pass the user's email from the frontend
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    // Find the user by email and update the specific order status to "Cancelled"
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Find the order in user's orders array
    const order = user.orders?.find((o: any) => o.orderId === params.orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Update order status and cancellation time
    order.status = "Cancelled";
    order.cancelledAt = new Date();

    // Optionally: add the coins from this order into walletHistory (if needed)
    // For example, push an entry to walletHistory for the current year.
    const currentYear = new Date().getFullYear();
    const existingHistory = user.walletHistory?.find((h: any) => h.year === currentYear);
    if (existingHistory) {
      existingHistory.coins += order.totalAmount; // Or some coin calculation logic
    } else {
      user.walletHistory = user.walletHistory || [];
      user.walletHistory.push({ year: currentYear, coins: order.totalAmount });
    }

    await user.save();

    // Optionally, send a notification to admin or log the cancellation.
    return NextResponse.json({
      success: true,
      message: `Order ${order.orderId} cancelled successfully by ${user.fullName} (${user.email}).`,
    });
  } catch (error: any) {
    console.error("Error cancelling order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
