export function coerceImageDataUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.startsWith("data:image/")) {
    return undefined;
  }

  return value;
}

export function isSvgImageDataUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.toLowerCase().startsWith("data:image/svg+xml")
  );
}
