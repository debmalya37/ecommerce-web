// models/categoryModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
});

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
export default Category;