// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/categoryModel";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";

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
    const { name, icon, iconColor, iconFile } = await req.json();
    
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }
    
    let finalIcon = icon || "";
    
    if (iconFile) {
      // If the file data is sent as a Data URL, remove the prefix
      const base64Data = iconFile.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      try {
        finalIcon = await uploadToCloudinary(buffer);
      } catch (uploadError: any) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
      }
    }
    
    const newCategory = new Category({ name, slug, icon: finalIcon, iconColor });
    await newCategory.save();
    
    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create category", details: error.message },
      { status: 500 }
    );
  }
}
