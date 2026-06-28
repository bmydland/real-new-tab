import { parseToRgb, readableColor, rgba } from "polished";

export function coerceHexColor(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  try {
    const color = parseToRgb(value.trim());
    return `#${toHexChannel(color.red)}${toHexChannel(color.green)}${toHexChannel(color.blue)}`;
  } catch {
    return fallback;
  }
}

export function getReadableTileTextColor(background: string): string {
  return readableColor(background, "#111716", "#ffffff", false);
}

export function translucentBlack(alpha: number): string {
  return rgba(6, 12, 14, alpha);
}

function toHexChannel(channel: number): string {
  return channel.toString(16).padStart(2, "0");
}
