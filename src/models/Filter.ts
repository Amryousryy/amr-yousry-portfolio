import mongoose, { Schema, Document } from "mongoose";

export interface IFilter extends Document {
  name: { en: string; ar: string };
  slug: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BilingualSchema = new Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true },
}, { _id: false });

const FilterSchema: Schema = new Schema({
  name: { type: BilingualSchema, required: true },
  slug: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

FilterSchema.index({ active: 1, order: 1 });

export default mongoose.models.Filter || mongoose.model<IFilter>("Filter", FilterSchema);
