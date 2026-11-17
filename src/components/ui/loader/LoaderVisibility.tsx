"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  LOADER_CRITICAL_IMAGE_ATTRIBUTE,
  LOADER_DEFERRED_IMAGE_ATTRIBUTE,
  REVEALED_ATTRIBUTE,
  REVEALED_EVENT,
} from "@constants/loader";
import prefetchAllImages from "@utils/prefetchAllImages";

/** Past the fade-out (1s, see Loader.module.css), the loader is taken as gone even if its transitionend
 * never came (e.g. a transition cut short): the intro animations wait for it */
const FADE_OUT_FALLBACK_MS = 1500;

/** Resolves once the image is decoded (or has failed), so revealing it never shows a half-painted image. */
const whenImageReady = (img: HTMLImageElement) =>
  img.decode ? img.decode().catch(() => undefined) : Promise.resolve();

/** Resolves once the image has loaded (or failed), without decoding it */
const whenImageLoaded = (img: HTMLImageElement) =>
  img.complete
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      });

/**
 * Shows its children until the first screen is ready (or while `open`), then fades out and unmounts.
 * "Ready" = the fonts and the images marked as critical (the route's section background and the planet).
 * Waiting for `window.load` instead would also wait for every other section's background.
 * Once ready, the deferred (lazy) images are fetched, so they're in place before they're scrolled to.
 * Once those have loaded too, every other version of the images is downloaded in the background
 * (see prefetchAllImages).
 *
 * Once it has faded out, it marks the page revealed (REVEALED_ATTRIBUTE on <html>, see useRevealed):
 * the intro animations start then, on the page in full view, rather than under it, or under its fade.
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

      const deferredImages = Array.from(
        document.querySelectorAll<HTMLImageElement>(
          `img[${LOADER_DEFERRED_IMAGE_ATTRIBUTE}]`
        )
      );
      deferredImages.forEach((img) => img.setAttribute("loading", "eager"));

      void Promise.all(deferredImages.map(whenImageLoaded)).then(() => {
        if (!isCancelled) {
          prefetchAllImages();
        }
      });
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  const shown = !isFirstScreenReady || !!open;

  /** Faded out: the page is in full view */
  const gone = !shown && !isLoader;

  // Covering the page, or fading out: not revealed (again, if it's shown anew); gone: revealed
  useEffect(() => {
    const root = document.documentElement;
    if (!gone) {
      root.removeAttribute(REVEALED_ATTRIBUTE);
    } else if (!root.hasAttribute(REVEALED_ATTRIBUTE)) {
      root.setAttribute(REVEALED_ATTRIBUTE, "");
      window.dispatchEvent(new Event(REVEALED_EVENT));
    }
  }, [gone]);

  // Fading out: gone once its transition ends (see handleTransitionEnd), or past the fade at the latest
  useEffect(() => {
    if (shown || !isLoader) {
      return;
    }
    const timer = setTimeout(() => setIsLoader(false), FADE_OUT_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [shown, isLoader]);

  /** Once the loader has faded out, it's removed */
  const handleTransitionEnd = () => setIsLoader(false);

  if (!isLoader && !open) {
    return null;
  }

  return (
    <div
      data-nosnippet
      onTransitionEnd={handleTransitionEnd}
      data-open={shown}
      className={className}
    >
      {children}
    </div>
  );
}
