import type { ActivityAction, ActivityTargetType } from "@/types/activity";
import dbConnect from "./db";
import ActivityLog from "@/models/ActivityLog";

interface LogParams {
  action: ActivityAction;
  targetType: ActivityTargetType;
  targetName: string;
  adminEmail: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity({
  action,
  targetType,
  targetName,
  adminEmail,
  metadata
}: LogParams) {
  try {
    await dbConnect();
    await ActivityLog.create({
      action,
      targetType,
      targetName,
      adminEmail,
      metadata,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
