"use client";

import { useEffect } from "react";
import Button from "@ui/button/button";
import { BUTTON_LABEL, LABEL } from "./error.constants";
import Errors from "@components/errors/errors";

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
    <Errors label={LABEL}>
      <Button onClick={handleClick}>{BUTTON_LABEL}</Button>
    </Errors>
  );
}
