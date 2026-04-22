import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
  offerType: "general" | "free_audit";
  status: "new" | "contacted" | "qualified" | "closed";
  createdAt: Date;
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  projectType: { type: String, required: true },
  message: { type: String, required: true },
  offerType: { type: String, enum: ["general", "free_audit"], default: "general" },
  status: { type: String, enum: ["new", "contacted", "qualified", "closed"], default: "new" },
  createdAt: { type: Date, default: Date.now },
});

// Index for fast sorting by date
LeadSchema.index({ createdAt: -1 });

export default mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
