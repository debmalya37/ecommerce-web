import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/categoryModel";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to your database
    await dbConnect();
    
    // Attempt to delete the category by its id
    const deletedCategory = await Category.findByIdAndDelete(params.id);

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: deletedCategory });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete category", details: error.message },
      { status: 500 }
    );
  }
}
