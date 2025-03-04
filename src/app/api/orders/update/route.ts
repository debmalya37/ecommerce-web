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

    // Find the user who has this order
    const user = await User.findOne({ "orders.orderId": orderId });
    if (!user) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    // Update the order status
    const order = user.orders.find((o: { orderId: any; }) => o.orderId === orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }
    order.status = newStatus;

    // Optionally, update timestamps if cancelled
    if (newStatus === "Cancelled") {
      order.cancelledAt = new Date();
    }

    await user.save();
    return NextResponse.json({ success: true, message: "Order updated successfully.", order });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
