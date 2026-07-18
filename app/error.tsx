"use client";

import styles from "./error.module.css";
import { useEffect } from "react";
import Button from "@ui/button/button";
import Typography from "@ui/typography/typography";
import { BUTTON_LABEL, LABEL } from "./error.constants";

type ErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function Error({ error, unstable_retry }: ErrorProps) {
  const handleClick = () => unstable_retry();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.error}>
      <Typography component="h2" color="paper" variant="project-heading">
        {LABEL}
      </Typography>
      <Button onClick={handleClick}>{BUTTON_LABEL}</Button>
    </div>
  );
}
