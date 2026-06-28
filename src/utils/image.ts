export function coerceImageDataUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.startsWith("data:image/")) {
    return undefined;
  }

  return value;
}
