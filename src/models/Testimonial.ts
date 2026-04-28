import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  quote: string;
  projectSlug?: string;
  avatar?: string;
  rating: number;
  isFeatured: boolean;
  status: "draft" | "published";
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  quote: { type: String, required: true },
  projectSlug: { type: String },
  avatar: { type: String },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

TestimonialSchema.index({ status: 1, displayOrder: 1 });
TestimonialSchema.index({ isFeatured: 1, status: 1 });

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);