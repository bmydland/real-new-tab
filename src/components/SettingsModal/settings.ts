import type { BackgroundPosition, ToolbarRevealMode } from "~/settings";

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

export const TOOLBAR_REVEAL_OPTIONS: Array<{
  description: string;
  label: string;
  value: ToolbarRevealMode;
}> = [
  {
    label: "On hover",
    description: "Reveal the toolbar when the pointer moves over it.",
    value: "hover",
  },
  {
    label: "On keypress",
    description: "Press a chosen key to show or hide the toolbar.",
    value: "keypress",
  },
];
