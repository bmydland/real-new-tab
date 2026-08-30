import { coerceHexColor } from "~/utils/color";
import { coerceImageDataUrl } from "~/utils/image";
import { isRecord } from "~/utils/isRecord";
import { DEFAULT_SETTINGS } from "./defaultSettings";
import { TILE_SIZE_SCALE_RANGE } from "./constants";
import { migrateTile } from "./migrateTile";
import { normalizeToolbarRevealKey } from "./toolbarRevealKey";
import type {
  AppSettings,
  BackgroundPosition,
  TileType,
  ToolbarRevealMode,
} from "./types";

const BACKGROUND_POSITIONS: BackgroundPosition[] = [
  "top",
  "left",
  "center",
  "right",
  "bottom",
];

const TOOLBAR_REVEAL_MODES: ToolbarRevealMode[] = ["hover", "keypress"];

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
    tileSizeScale: coerceTileSizeScale(value.tileSizeScale),
    toolbarRevealMode: coerceToolbarRevealMode(value.toolbarRevealMode),
    toolbarRevealKey:
      normalizeToolbarRevealKey(value.toolbarRevealKey) ??
      DEFAULT_SETTINGS.toolbarRevealKey,
    tiles: Array.isArray(value.tiles)
      ? value.tiles.map(migrateTile).filter(isTile)
      : [],
  };
}

function coerceToolbarRevealMode(value: unknown): ToolbarRevealMode {
  return typeof value === "string" &&
    TOOLBAR_REVEAL_MODES.includes(value as ToolbarRevealMode)
    ? (value as ToolbarRevealMode)
    : DEFAULT_SETTINGS.toolbarRevealMode;
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

function coerceTileSizeScale(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(
        TILE_SIZE_SCALE_RANGE.max,
        Math.max(TILE_SIZE_SCALE_RANGE.min, value),
      )
    : DEFAULT_SETTINGS.tileSizeScale;
}

function isTile(value: TileType | null): value is TileType {
  return value !== null;
}
