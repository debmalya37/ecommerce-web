// src/models/offerModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOffer extends Document {
  cutoff: number; // Minimum order amount to qualify for this discount
  discountPercentage: number; // Discount percentage to apply (e.g. 10 for 10%)
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    cutoff: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Offer = mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);
export default Offer;
