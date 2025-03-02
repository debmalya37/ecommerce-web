import mongoose, { Schema, Document } from "mongoose";

export interface IVariant {
  color: string;
  images: string[];
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  stock: number;
  category: string;
  variants?: IVariant[];
}

const VariantSchema = new Schema<IVariant>({
  color: { type: String, required: true },
  images: [{ type: String, required: true }],
  stock: { type: Number, default: 0 },
});

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  images: [{ type: String, required: true }],
  stock: { type: Number, default: 10 },
  category: { type: String, required: true },
  // New: array of color-based variants
  variants: [VariantSchema],
});

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
