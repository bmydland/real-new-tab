import { coerceHexColor } from "../utils/color";
import { coerceImageDataUrl } from "../utils/image";
import { isRecord } from "../utils/isRecord";
import { DEFAULT_SETTINGS } from "./defaultSettings";
import { migrateTile } from "./migrateTile";
import type { AppSettings, Tile } from "./types";

export function migrateSettings(value: unknown): AppSettings {
  if (!isRecord(value)) {
    return DEFAULT_SETTINGS;
  }

  return {
    version: 1,
    backgroundColor: coerceHexColor(value.backgroundColor, DEFAULT_SETTINGS.backgroundColor),
    backgroundImage: coerceImageDataUrl(value.backgroundImage),
    tiles: Array.isArray(value.tiles) ? value.tiles.map(migrateTile).filter(isTile) : [],
  };
}

function isTile(value: Tile | null): value is Tile {
  return value !== null;
}
