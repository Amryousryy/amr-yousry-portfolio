import mongoose, { Schema, Document } from "mongoose";
import type { ActivityAction, ActivityTargetType } from "@/types/activity";

export interface IActivityLog extends Document {
  action: ActivityAction;
  targetType: ActivityTargetType;
  targetName: string;
  adminEmail: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
  action: { type: String, required: true },
  targetType: { type: String, required: true },
  targetName: { type: String, required: true },
  adminEmail: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

// Use createdAt (managed by timestamps) as the canonical time reference
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ adminEmail: 1, createdAt: -1 });
ActivityLogSchema.index({ targetType: 1, action: 1 });

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
