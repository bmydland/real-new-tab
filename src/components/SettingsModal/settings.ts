import type { BackgroundPosition } from "~/settings";

export const GRID_ROW_OPTIONS = [2, 3, 4, 5];

export const BACKGROUND_POSITION_OPTIONS: Array<{
  label: string;
  value: BackgroundPosition;
}> = [
  { label: "Top", value: "top" },
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
  { label: "Bottom", value: "bottom" },
];
