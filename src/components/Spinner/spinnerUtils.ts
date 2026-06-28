import { SpinnerType } from "./types";

export const getStrokeColor = (type: SpinnerType): string => {
  switch (type) {
    case SpinnerType.Light:
      return "var(--color-light)";
    case SpinnerType.Dark:
      return "var(--color-primary)";
    case SpinnerType.Default:
      return "currentColor"; // Inherit
  }
};
