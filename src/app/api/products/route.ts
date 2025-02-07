import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (productId) {
      // Fetch a specific product
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    // Fetch all products if no ID is provided
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch products", details: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, description, price, originalPrice, images, stock, category } = await req.json();

    if (!name || !description || !price || !originalPrice || !images || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = new Product({ name, description, price, originalPrice, images, stock, category });
    await newProduct.save();

    return NextResponse.json({ message: "Product added successfully", product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add product", details: error.message }, { status: 500 });
  }
}


// DELETE: Remove Product by ID
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete product", details: error.message }, { status: 500 });
  }
}