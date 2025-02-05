import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"; // Adjust the path if needed
import User from "@/models/userModel";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get session from next-auth
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user details from database
    const user = await User.findOne({ email: session.user.email }).select(
      "-password" // Exclude password from response
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
    try {
      await dbConnect();
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { phone, address, state, pincode, country } = await req.json();
  
      const updatedUser = await User.findOneAndUpdate(
        { email: session.user.email },
        { phone, address, state, pincode, country },
        { new: true }
      );
  
      if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
  
      return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error: any) {
      return NextResponse.json({ error: "Failed to update user", details: error.message }, { status: 500 });
    }
  }