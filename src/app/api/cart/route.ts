import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cartItems } = await req.json();
  const user = await User.findOne({ email: session.user.email });
  
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  user.cart = cartItems;
  await user.save();

  return NextResponse.json({ success: true, message: "Cart updated successfully" });
}


export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email })
      .populate({
        path: 'cart._id', // Populate product details
        model: 'Product'
      })
      .select('-password');

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Format the cart response as per your requirement
    const formattedCart = user.cart.map((item: any) => ({
      productId: item._id._id,  // Store product ID separately
      quantity: item.quantity, // Keep quantity as it is
      productDetails: item._id,  // Store full product details under a new key
    }));

    return NextResponse.json({ cart: formattedCart });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch cart", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();
  const user = await User.findOne({ email: session.user.email });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Remove item where cart-level productId matches the productId in the request
  const updatedCart = user.cart.filter((item: any) => item.productId !== productId);

  await User.updateOne({ email: session.user.email }, { $set: { cart: updatedCart } });

  return NextResponse.json({ success: true, message: "Item removed from cart" });
}

