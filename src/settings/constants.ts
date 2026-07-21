import type { TileSize } from "./types";

export const STORAGE_KEY = "realNewTab.settings";

export const TILE_SIZES = [
  "normal",
  "wide",
  "large",
] as const satisfies readonly TileSize[];

export const TILE_ICON_SIZE_RANGE = {
  default: 50,
  min: 20,
  max: 100,
  step: 5,
} as const;
