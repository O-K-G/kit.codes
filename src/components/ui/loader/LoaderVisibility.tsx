"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  LOADER_CRITICAL_IMAGE_ATTRIBUTE,
  LOADER_DEFERRED_IMAGE_ATTRIBUTE,
} from "@constants/loader";

/** Resolves once the image is decoded (or has failed), so revealing it never shows a half-painted image. */
const whenImageReady = (img: HTMLImageElement) =>
  img.decode ? img.decode().catch(() => undefined) : Promise.resolve();

/**
 * Shows its children until the first screen is ready (or while `open`), then fades out and unmounts.
 * "Ready" = the fonts and the images marked as critical (the route's section background and the planet).
 * Waiting for `window.load` instead would also wait for every other section's background.
 * Once ready, the deferred (lazy) images are fetched, so they're in place before they're scrolled to.
 */
export default function LoaderVisibility({
  open,
  className,
  children,
}: {
  open?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [isFirstScreenReady, setIsFirstScreenReady] = useState(false);
  const [isLoader, setIsLoader] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    const criticalImages = Array.from(
      document.querySelectorAll<HTMLImageElement>(
        `img[${LOADER_CRITICAL_IMAGE_ATTRIBUTE}]`
      )
    );

    void Promise.all([
      document.fonts?.ready,
      ...criticalImages.map(whenImageReady),
    ]).then(() => {
      if (!isCancelled) {
        setIsFirstScreenReady(true);
      }

      document
        .querySelectorAll<HTMLImageElement>(
          `img[${LOADER_DEFERRED_IMAGE_ATTRIBUTE}]`
        )
        .forEach((img) => img.setAttribute("loading", "eager"));
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!isLoader && !open) {
    return null;
  }

  return (
    <div
      data-nosnippet
      onTransitionEnd={() => setIsLoader(false)}
      data-open={!!(!isFirstScreenReady || open)}
      className={className}
    >
      {children}
    </div>
  );
}
