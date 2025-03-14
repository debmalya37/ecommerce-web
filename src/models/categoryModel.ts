// models/categoryModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  iconColor?: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String },
  iconColor: { type: String },
});

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
export default Category;
