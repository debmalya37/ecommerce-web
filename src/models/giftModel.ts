import mongoose, { Schema, Document } from "mongoose";

export interface IGift extends Document {
  recipientEmail: string;
  recipientName: string;
  giftDetails: string;
  quantity: number;
  status: "Sent" | "Delivered" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const GiftSchema = new Schema<IGift>(
  {
    recipientEmail: { type: String, required: true },
    recipientName: { type: String, required: true },
    giftDetails: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ["Sent", "Delivered", "Cancelled"], default: "Sent" },
  },
  { timestamps: true }
);

const Gift = mongoose.models.Gift || mongoose.model<IGift>("Gift", GiftSchema);
export default Gift;
