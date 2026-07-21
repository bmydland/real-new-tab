import { coerceHexColor } from "~/utils/color";
import { coerceImageDataUrl } from "~/utils/image";
import { isRecord } from "~/utils/isRecord";
import { DEFAULT_SETTINGS } from "./defaultSettings";
import { migrateTile } from "./migrateTile";
import type { AppSettings, BackgroundPosition, TileType } from "./types";

const BACKGROUND_POSITIONS: BackgroundPosition[] = [
  "top",
  "left",
  "center",
  "right",
  "bottom",
];

export function migrateSettings(value: unknown): AppSettings {
  if (!isRecord(value)) {
    return DEFAULT_SETTINGS;
  }

  return {
    version: 1,
    backgroundColor: coerceHexColor(
      value.backgroundColor,
      DEFAULT_SETTINGS.backgroundColor,
    ),
    backgroundImage: coerceImageDataUrl(value.backgroundImage),
    backgroundPosition: coerceBackgroundPosition(value.backgroundPosition),
    gridRows: coerceGridRows(value.gridRows),
    tiles: Array.isArray(value.tiles)
      ? value.tiles.map(migrateTile).filter(isTile)
      : [],
  };
}

function coerceBackgroundPosition(value: unknown): BackgroundPosition {
  return typeof value === "string" &&
    BACKGROUND_POSITIONS.includes(value as BackgroundPosition)
    ? (value as BackgroundPosition)
    : DEFAULT_SETTINGS.backgroundPosition;
}

function coerceGridRows(value: unknown): number {
  return typeof value === "number" && Number.isInteger(value)
    ? Math.min(6, Math.max(2, value))
    : DEFAULT_SETTINGS.gridRows;
}

function isTile(value: TileType | null): value is TileType {
  return value !== null;
}
