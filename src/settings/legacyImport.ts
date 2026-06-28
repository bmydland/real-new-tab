import { coerceHexColor } from "../utils/color";
import { isRecord } from "../utils/isRecord";
import { normalizeUrl } from "../utils/url";
import { createTileId } from "./createTileId";
import type { Tile, TileSize } from "./types";

export function legacyTileToTile(value: unknown): Tile | null {
  if (!isRecord(value)) {
    return null;
  }

  const label = typeof value.etiqueta === "string" ? value.etiqueta.trim() : "";
  const url = typeof value.link === "string" ? value.link : "";

  if (!label || !url || url.startsWith("/")) {
    return null;
  }

  const now = new Date().toISOString();

  return {
    id: createTileId(),
    url: normalizeUrl(url),
    label,
    color: coerceHexColor(value.bgcolor, "#008a8a"),
    size: legacyTileSize(value.dimens),
    createdAt: now,
    updatedAt: now,
  };
}

function legacyTileSize(value: unknown): TileSize {
  const dimensions = Array.isArray(value) ? value.join("x") : "";

  if (dimensions === "4x4") {
    return "large";
  }

  if (dimensions === "4x2") {
    return "wide";
  }

  return "normal";
}
