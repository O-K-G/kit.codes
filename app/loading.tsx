import Errors from "@components/errors/errors";
import { LABEL } from "./loading.constants";
import styles from "./loading.module.css";

export default function Loading() {
  return <Errors label={LABEL} className={styles.loading} />;
}
