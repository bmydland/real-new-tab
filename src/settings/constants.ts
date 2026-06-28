import type { TileSize } from "./types";

export const STORAGE_KEY = "realNewTab.settings";
export const TILE_SIZES = ["normal", "wide", "large"] as const satisfies readonly TileSize[];
