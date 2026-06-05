export type ActivityAction = "create" | "update" | "delete" | "login" | "publish";

export type ActivityTargetType = "project" | "settings" | "auth";

export type ActivityMetadata = Record<string, unknown>;

export interface ActivityEntry {
  action: ActivityAction;
  targetType: ActivityTargetType;
  targetName: string;
  adminEmail: string;
  metadata?: ActivityMetadata;
  createdAt: Date;
  updatedAt: Date;
}
