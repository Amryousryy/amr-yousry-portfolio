export function safeProjectTitle(project: { title?: string } | null | undefined): string {
  return typeof project?.title === "string" && project.title.trim()
    ? project.title
    : "Untitled project";
}
