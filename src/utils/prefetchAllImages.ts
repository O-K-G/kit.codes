/** How many images are downloaded at once */
const CONCURRENCY = 3;

/** Every image address in the page's srcsets: each version of each image, for every screen */
function allImageUrls() {
  const srcsets = Array.from(
    document.querySelectorAll<HTMLSourceElement | HTMLImageElement>("picture source[srcset], img[srcset]"),
    (element) => element.srcset
  );
  const urls = srcsets.flatMap((srcset) =>
    srcset.split(",").map((candidate) => candidate.trim().split(/\s+/)[0])
  );

  return [...new Set(urls.filter(Boolean).map((url) => new URL(url, document.baseURI).href))];
}

/** Whether the visitor asked to save data, or is on a very slow connection */
function isSavingData() {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;

  return !!connection?.saveData || /2g/.test(connection?.effectiveType ?? "");
}

/** Downloads one image into the browser's cache, at the lowest priority, without decoding it */
function prefetch(url: string) {
  return new Promise<void>((resolve) => {
    const link = document.createElement("link");
    if (link.relList?.supports?.("prefetch")) {
      link.rel = "prefetch";
      link.href = url;
      link.onload = link.onerror = () => {
        link.remove();
        resolve();
      };
      document.head.append(link);
      return;
    }

    // Without prefetch (Safari): an image that's never shown is downloaded but not decoded
    const image = new Image();
    image.fetchPriority = "low";
    image.onload = image.onerror = () => resolve();
    image.src = url;
  });
}

/**
 * Downloads every version of the page's images not downloaded yet (every breakpoint and screen
 * density), so whatever the screen turns to (rotated, resized, zoomed, another monitor), its version is
 * already cached. To keep it from touching the page's loading and responsiveness, it's meant to run
 * once everything the page shows is loaded, and starts once the browser is idle. It downloads at the
 * lowest priority, a few at a time, without decoding. Skipped when the visitor saves data.
 */
export default function prefetchAllImages() {
  if (isSavingData()) {
    return;
  }

  const start = () => {
    const downloaded = new Set(
      performance.getEntriesByType("resource").map(({ name }) => name)
    );
    const queue = allImageUrls().filter((url) => !downloaded.has(url));
    const next = (): Promise<void> => {
      const url = queue.shift();
      return url ? prefetch(url).then(next) : Promise.resolve();
    };

    for (let i = 0; i < CONCURRENCY; i += 1) {
      void next();
    }
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(start, { timeout: 5000 });
  } else {
    setTimeout(start, 1000);
  }
}
