import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

// POST: Update an Existing Product
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { id, name, description, price, originalPrice, images, stock, category } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, originalPrice, images, stock, category },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update product", details: error.message }, { status: 500 });
  }
}
