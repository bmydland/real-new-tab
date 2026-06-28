import { SpinnerSize, SpinnerType } from "./types";
import { getStrokeColor } from "./spinnerUtils";
import styles from "./Spinner.module.scss";

interface SpinnerProps {
  size?: SpinnerSize;
  type?: SpinnerType;
  ariaLabel?: string;
}

export function Spinner({
  size = SpinnerSize.Xs,
  type = SpinnerType.Default,
  ariaLabel = "",
}: SpinnerProps) {
  const strokeColor = getStrokeColor(type);

  return (
    <div
      aria-label={ariaLabel || "Laster..."}
      style={{ width: size, height: size }}
      role="status"
    >
      <svg className={styles.spinner} viewBox="0 0 24 24">
        <circle
          className={styles.path}
          style={{ stroke: strokeColor }}
          cx="12"
          cy="12"
          r="9.6"
          fill="none"
          strokeWidth="2.4"
        />
      </svg>
    </div>
  );
}
