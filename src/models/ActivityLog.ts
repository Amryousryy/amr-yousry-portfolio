import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  action: "create" | "update" | "delete" | "login" | "publish";
  targetType: "project" | "settings" | "auth";
  targetName: string; // Title of project or setting name
  adminEmail: string;
  timestamp: Date;
  metadata?: any;
}

const ActivityLogSchema: Schema = new Schema({
  action: { type: String, required: true },
  targetType: { type: String, required: true },
  targetName: { type: String, required: true },
  adminEmail: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed },
});

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
