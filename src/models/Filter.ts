import mongoose, { Schema, Document } from "mongoose";

export interface IFilter extends Document {
  name: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const FilterSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

FilterSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.models.Filter || mongoose.model<IFilter>("Filter", FilterSchema);