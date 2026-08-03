import type { TileSize } from "~/settings";
import { TILE_ICON_SIZE_RANGE } from "~/settings/constants";
import type { TileFormValue } from "~/types";

export const EMPTY_TILE_FORM: TileFormValue = {
  url: "",
  label: "",
  color: "#000000",
  size: "normal",
  iconSize: TILE_ICON_SIZE_RANGE.default,
};

export const TILE_SIZE_OPTIONS: Array<{ value: TileSize; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "wide", label: "Wide" },
  { value: "large", label: "Large" },
];
