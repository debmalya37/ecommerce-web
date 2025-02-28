// src/models/coinEarningRate.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICoinEarningRate extends Document {
  rate: number; // Rupees required to earn one coin
}

const CoinEarningRateSchema = new Schema<ICoinEarningRate>({
  rate: { type: Number, required: true, default: 50 }, // default rate: 50 rupees per coin
});

// Use existing model if defined, otherwise create a new one.
const CoinEarningRate =
  mongoose.models.CoinEarningRate ||
  mongoose.model<ICoinEarningRate>("CoinEarningRate", CoinEarningRateSchema);

export default CoinEarningRate;
