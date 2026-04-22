import dbConnect from "./db";
import ActivityLog from "@/models/ActivityLog";

interface LogParams {
  action: "create" | "update" | "delete" | "login" | "publish";
  targetType: "project" | "settings" | "auth";
  targetName: string;
  adminEmail: string;
  metadata?: any;
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
