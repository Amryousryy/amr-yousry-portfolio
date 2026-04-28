import mongoose, { Schema, Document } from "mongoose";

export interface IAnalytics extends Document {
  type: "page_view" | "interaction";
  page: string;
  projectId?: string;
  interactionType?: string;
  // canonical timestamp is createdAt (from timestamps: true)
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema: Schema = new Schema({
  type: { type: String, enum: ["page_view", "interaction"], required: true },
  page: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project" },
  interactionType: { type: String },
  // remove legacy timestamp field in favor of createdAt
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

AnalyticsSchema.index({ createdAt: -1 });
AnalyticsSchema.index({ page: 1, createdAt: -1 });
AnalyticsSchema.index({ type: 1, createdAt: -1 });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
