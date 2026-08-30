import type { AppSettings } from "./types";
import { TILE_SIZE_SCALE_RANGE } from "./constants";

export const DEFAULT_SETTINGS: AppSettings = {
  version: 1,
  backgroundColor: "#101816",
  backgroundPosition: "center",
  gridRows: 2,
  tileSizeScale: TILE_SIZE_SCALE_RANGE.default,
  toolbarRevealMode: "hover",
  toolbarRevealKey: "Enter",
  tiles: [],
};
