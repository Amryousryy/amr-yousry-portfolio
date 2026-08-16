export interface StatusMetadata {
  lastStatusChangeAt: Date;
  publishedAt?: Date;
}

export function resolveStatusMetadata(newStatus: string, currentStatus: string): StatusMetadata {
  const metadata: StatusMetadata = {
    lastStatusChangeAt: new Date(),
  };
  if (newStatus === "published" && currentStatus !== "published") {
    metadata.publishedAt = new Date();
  }
  return metadata;
}
