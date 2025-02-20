import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/notificationModel";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const deleted = await Notification.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Notification deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete notification", details: error.message },
      { status: 500 }
    );
  }
}
