// app/api/orders/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { orderId, newStatus } = await req.json();
    if (!orderId || !newStatus) {
      return NextResponse.json(
        { success: false, error: "Order ID and new status are required." },
        { status: 400 }
      );
    }

    // Find the user whose orders array has an order with this orderId
    const user = await User.findOne({ "orders.orderId": orderId });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    // Update the correct order; note that if there are duplicates, only the first will be updated.
    const order = user.orders.find((o:any) => o.orderId === orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }
    order.status = newStatus;
    // Optionally update timestamps (e.g., cancelledAt) based on status
    if (newStatus === "Cancelled") {
      order.cancelledAt = new Date();
    }
    await user.save();

    // Return updated order info with no caching
    return NextResponse.json(
      { success: true, order },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
