import mongoose, { Schema, Document } from "mongoose";

export interface IAnalytics extends Document {
  type: "page_view" | "interaction";
  page: string;
  projectId?: string;
  interactionType?: string;
  referrer?: string;
  referrerDomain?: string;
  category?: string;
  label?: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  visitorHash?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema: Schema = new Schema({
  type: { type: String, enum: ["page_view", "interaction"], required: true },
  page: { type: String, required: true },
  projectId: { type: String },
  interactionType: { type: String },
  referrer: { type: String },
  referrerDomain: { type: String },
  category: { type: String },
  label: { type: String },
  userAgent: { type: String },
  deviceType: { type: String },
  browser: { type: String },
  os: { type: String },
  visitorHash: { type: String },
  sessionId: { type: String },
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

AnalyticsSchema.index({ createdAt: -1 });
AnalyticsSchema.index({ page: 1, createdAt: -1 });
AnalyticsSchema.index({ type: 1, createdAt: -1 });
AnalyticsSchema.index({ interactionType: 1, createdAt: -1 });
AnalyticsSchema.index({ visitorHash: 1, createdAt: -1 });
AnalyticsSchema.index({ sessionId: 1, createdAt: -1 });
AnalyticsSchema.index({ deviceType: 1, createdAt: -1 });
AnalyticsSchema.index({ referrerDomain: 1, createdAt: -1 });
AnalyticsSchema.index({ projectId: 1, createdAt: -1 });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
