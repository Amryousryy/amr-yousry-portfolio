import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  action: "create" | "update" | "delete" | "login" | "publish";
  targetType: "project" | "settings" | "auth";
  targetName: string;
  adminEmail: string;
  metadata?: any;
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

ActivityLogSchema.index({ timestamp: -1 });
ActivityLogSchema.index({ adminEmail: 1, timestamp: -1 });
ActivityLogSchema.index({ targetType: 1, action: 1 });

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
