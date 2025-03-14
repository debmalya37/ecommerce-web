// src/models/offlinePurchase.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOfflinePurchase extends Document {
  name: string;
  email?: string;
  phone: string;
  address: string;
  amountPaid: number;
  dueAmount?: number;
  dateOfPayment: Date;
  coinsEarned: number; // <-- New field for wallet coin earning
}

const OfflinePurchaseSchema = new Schema<IOfflinePurchase>(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    dueAmount: { type: Number, default: 0 },
    dateOfPayment: { type: Date, required: true },
    coinsEarned: { type: Number, default: 0 }, // Default to 0 if not calculated
  },
  { timestamps: true }
);

const OfflinePurchase =
  mongoose.models.OfflinePurchase ||
  mongoose.model<IOfflinePurchase>("OfflinePurchase", OfflinePurchaseSchema);

export default OfflinePurchase;
