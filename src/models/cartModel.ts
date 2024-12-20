// src/models/Cart.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct } from './product';

interface CartItem {
  product: IProduct['_id'];  // Reference to Product ID
  quantity: number;
}

export interface ICart extends Document {
  userId: string;         // Reference to user (or use a session ID if no auth)
  items: CartItem[];
}

const CartSchema: Schema = new Schema({
  userId: { type: String, required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
});

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
