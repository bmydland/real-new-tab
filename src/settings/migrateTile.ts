import { coerceHexColor } from "~/utils/color";
import { coerceImageDataUrl } from "~/utils/image";
import { isRecord } from "~/utils/isRecord";
import { normalizeUrl } from "~/utils/url";
import { createTileId } from "./createTileId";
import { TILE_ICON_SIZE_RANGE, TILE_SIZES } from "./constants";
import type { TileType, TileSize } from "./types";

const DEFAULT_TILE_COLOR = "#008a8a";

export function migrateTile(value: unknown): TileType | null {
  if (!isRecord(value)) {
    return null;
  }

  const label = typeof value.label === "string" ? value.label.trim() : "";
  const url = typeof value.url === "string" ? normalizeUrl(value.url) : "";

  if (!label || !url) {
    return null;
  }

  return {
    id: typeof value.id === "string" && value.id ? value.id : createTileId(),
    url,
    label,
    color: coerceHexColor(value.color, DEFAULT_TILE_COLOR),
    size: coerceTileSize(value.size),
    icon: coerceImageDataUrl(value.icon),
    iconSize: coerceTileIconSize(value.iconSize),
    createdAt:
      typeof value.createdAt === "string"
        ? value.createdAt
        : new Date().toISOString(),
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : new Date().toISOString(),
  };
}

function coerceTileIconSize(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return TILE_ICON_SIZE_RANGE.default;
  }

  return Math.min(
    TILE_ICON_SIZE_RANGE.max,
    Math.max(TILE_ICON_SIZE_RANGE.min, Math.round(value)),
  );
}

export function coerceTileSize(value: unknown): TileSize {
  return typeof value === "string" && TILE_SIZES.includes(value as TileSize)
    ? (value as TileSize)
    : "normal";
}
