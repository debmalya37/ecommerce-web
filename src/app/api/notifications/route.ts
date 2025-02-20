import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/notificationModel";

export async function GET() {
  try {
    await dbConnect();
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch notifications", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { title, message } = await req.json();
    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }
    const newNotification = new Notification({ title, message });
    await newNotification.save();
    return NextResponse.json({ success: true, notification: newNotification });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to add notification", details: error.message },
      { status: 500 }
    );
  }
}
