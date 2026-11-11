"use client";

import { ReactNode, useEffect, useState } from "react";

/** Shows its children until the window has loaded (or while `open`), then fades out and unmounts. */
export default function LoaderVisibility({
  open,
  className,
  children,
}: {
  open?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [isLoderVisible, setIsLoderVisible] = useState(true);
  const [isLoader, setIsLoader] = useState(true);

  useEffect(() => {
    const onLoad = () => {
      if (isLoderVisible) {
        setIsLoderVisible(false);
      }
    };

    if (isLoader) {
      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }

      return () => {
        window.removeEventListener("load", onLoad);
      };
    }
  }, [isLoader, isLoderVisible]);

  if (!isLoader && !open) {
    return null;
  }

  return (
    <div
      data-nosnippet
      onTransitionEnd={() => setIsLoader(false)}
      data-open={!!(isLoderVisible || open)}
      className={className}
    >
      {children}
    </div>
  );
}
