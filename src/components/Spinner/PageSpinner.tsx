import { Spinner } from "./Spinner";
import { SpinnerSize, SpinnerType } from "./types";
import styles from "./Spinner.module.scss";

export function PageSpinner() {
  return (
    <div className={styles["page-spinner"]}>
      <div className={styles["spinner-wrapper"]}>
        <Spinner size={SpinnerSize.Large} type={SpinnerType.Dark} />
      </div>
    </div>
  );
}
