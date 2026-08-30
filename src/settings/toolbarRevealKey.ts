const UNSUPPORTED_KEYS = new Set([
  "Alt",
  "AltGraph",
  "CapsLock",
  "Control",
  "Dead",
  "Escape",
  "Meta",
  "NumLock",
  "Process",
  "ScrollLock",
  "Shift",
  "Tab",
  "Unidentified",
]);

export function normalizeToolbarRevealKey(value: unknown): string | null {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > 32 ||
    UNSUPPORTED_KEYS.has(value)
  ) {
    return null;
  }

  return value.length === 1 ? value.toLowerCase() : value;
}

export function formatToolbarRevealKey(key: string): string {
  if (key === " ") {
    return "Space";
  }

  if (key.length === 1) {
    return key.toUpperCase();
  }

  return key.replace(/([a-z])([A-Z])/g, "$1 $2");
}
