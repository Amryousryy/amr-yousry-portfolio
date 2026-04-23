import mongoose, { Schema, Document } from "mongoose";

export interface IAnalytics extends Document {
  type: "page_view" | "interaction";
  page: string;
  projectId?: string;
  interactionType?: string;
  timestamp: Date;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema: Schema = new Schema({
  type: { type: String, enum: ["page_view", "interaction"], required: true },
  page: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project" },
  interactionType: { type: String },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

AnalyticsSchema.index({ timestamp: -1 });
AnalyticsSchema.index({ page: 1, timestamp: -1 });
AnalyticsSchema.index({ type: 1, timestamp: -1 });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
