import type { TileSize } from "~/settings";

// Common (maybe should be moved/restructured)
export type TileFormValue = {
  url: string;
  label: string;
  color: string;
  size: TileSize;
  icon?: string;
};
