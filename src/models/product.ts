import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  stock: number;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  images: [{ type: String, required: true }],
  stock: { type: Number, default: 10 },
});

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
