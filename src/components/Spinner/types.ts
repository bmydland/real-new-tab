export const SpinnerType = {
  Light: "light",
  Dark: "dark",
  Default: "default",
} as const;

export type SpinnerType = (typeof SpinnerType)[keyof typeof SpinnerType];

export const SpinnerSize = {
  Xs: "1.25rem",
  Small: "2.5rem",
  Medium: "3.75rem",
  Large: "5rem",
} as const;

export type SpinnerSize = (typeof SpinnerSize)[keyof typeof SpinnerSize];
