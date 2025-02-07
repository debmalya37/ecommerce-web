// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/categoryModel";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({});
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name } = await req.json();
    
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    const newCategory = new Category({ name, slug });
    await newCategory.save();

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create category", details: error.message },
      { status: 500 }
    );
  }
}