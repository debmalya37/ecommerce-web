// src/models/userModel.ts
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface ITransaction {
  transactionId: string;
  amount: number;
  products: string[]; // or a more complex object if needed
  date: Date;
}
export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  state: string;
  pincode: string;
  address: string;
  wallet: {
    balance: number;
    coins: number;
  };
  cart: {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];
  transactions: ITransaction[];
  otp?: string;         // New field to store OTP
  otpExpires?: Date;    // New field to store OTP expiration time
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  country: { type: String, default: "India" },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  wallet: { balance: { type: Number, default: 0 }, coins: { type: Number, default: 0 } },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  transactions: [
    {
      transactionId: { type: String, required: true },
      amount: { type: Number, required: true },
      products: [{ type: String }], // Array of product names (or IDs, etc.)
      date: { type: Date, default: Date.now },
    },
  ],
  otp: { type: String },
  otpExpires: { type: Date },
});

// Pre-save hook to hash password...
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
