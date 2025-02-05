import { NextResponse } from "next/server";
import User from "@/models/userModel";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { fullName, email, phone, password, state, pincode, address } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const newUser = new User({
      fullName,
      email,
      phone,
      password,
      state,
      pincode,
      address,
    });

    await newUser.save();
    return NextResponse.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error registering user" }, { status: 500 });
  }
}
