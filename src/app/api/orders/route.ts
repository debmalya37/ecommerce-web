// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, order } = await req.json();

    // Validate required fields
    if (!email || !order) {
      return NextResponse.json(
        { success: false, error: "Email and order data are required." },
        { status: 400 }
      );
    }

    // Validate that order.products is an array of objects
    if (!Array.isArray(order.products) || order.products.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order products must be a non-empty array of objects." },
        { status: 400 }
      );
    }

    // Validate each product object
    for (const prod of order.products) {
      if (!prod.productId || !prod.name || typeof prod.quantity !== "number" || typeof prod.price !== "number") {
        return NextResponse.json(
          { success: false, error: "Each product must have productId, name, quantity, and price." },
          { status: 400 }
        );
      }
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    // Check if an order with the same orderId already exists
    if (user.orders && user.orders.some((o: any) => o.orderId === order.orderId)) {
      return NextResponse.json({
        success: true,
        message: "Order already exists.",
        orders: user.orders,
      });
    }

    // Add the new order to the user's orders array
    user.orders.push(order);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Order added successfully.",
      orders: user.orders,
    });
  } catch (error: any) {
    console.error("Error adding order:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
