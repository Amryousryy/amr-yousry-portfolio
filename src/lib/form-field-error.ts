export function getFieldError(
  errors: Record<string, unknown>,
  path: string
): string | undefined {
  const parts = path.split(".");
  let current: Record<string, unknown> = errors;
  for (const part of parts) {
    if (current === undefined) return undefined;
    current = current[part] as Record<string, unknown>;
  }
  return current?.message as string | undefined;
}
