import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { routing } from "@i18n/routing";

/**
 * The link preview image (Open Graph; twitter-image.tsx reuses it), rendered from JSX at build time.
 * Next adds its og:image tags itself, with a content hash in the URL, so previews refetch it when it
 * changes. Only the subset of CSS that ImageResponse supports is used (flexbox, gradients, shadows).
 */

export const alt =
  "An astronaut working on a laptop, next to the words kit.codes, web development portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** One image per locale, rendered at build time */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const TITLE_PURPLE = "#ceb7ff";
const GLOW_PURPLE = "#b377ff";

/** The text block's area, kept clear of stars */
const TEXT_AREA = { left: 585, right: 1130, top: 190, bottom: 470 };

/** Stars at fixed pseudo-random spots (a seeded generator, so every build draws the same image) */
function getStars(count: number) {
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  return Array.from({ length: count }, () => ({
    x: Math.round(random() * size.width),
    y: Math.round(random() * size.height),
    diameter: [2, 2, 2, 3, 4][Math.floor(random() * 5)],
    opacity: 0.35 + random() * 0.55,
  })).filter(
    ({ x, y }) =>
      x < TEXT_AREA.left ||
      x > TEXT_AREA.right ||
      y < TEXT_AREA.top ||
      y > TEXT_AREA.bottom
  );
}

export default async function OpenGraphImage() {
  const publicDir = join(process.cwd(), "public");
  const [bebasNeue, icon] = await Promise.all([
    readFile(join(publicDir, "fonts/Bebas_Neue/BebasNeue-Regular.ttf")),
    readFile(join(publicDir, "images/android-chrome-512x512.png")),
  ]);
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
          backgroundImage: "linear-gradient(to bottom, #0c0824, #341e60)",
          fontFamily: "Bebas Neue",
          color: "#fff",
        }}
      >
        {getStars(140).map(({ x, y, diameter, opacity }, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: diameter,
              height: diameter,
              borderRadius: "50%",
              backgroundColor: "#fff",
              opacity,
            }}
          />
        ))}

        {/* The astronaut, over a soft purple glow */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 15,
            width: 600,
            height: 600,
            backgroundImage:
              "radial-gradient(circle, rgba(179, 119, 255, 0.45), rgba(179, 119, 255, 0) 65%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img
          src={iconSrc}
          alt=""
          width={440}
          height={440}
          style={{ position: "absolute", left: 100, top: 95 }}
        />

        <div
          style={{
            position: "absolute",
            left: 600,
            top: 200,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 168,
              lineHeight: 1,
              textShadow: `0 0 28px ${GLOW_PURPLE}, 0 0 10px ${GLOW_PURPLE}`,
            }}
          >
            KIT.CODES
          </div>
          <div
            style={{
              width: 496,
              height: 3,
              marginTop: 30,
              marginLeft: 4,
              backgroundColor: TITLE_PURPLE,
            }}
          />
          <div
            style={{
              marginTop: 30,
              paddingLeft: 4,
              fontSize: 50,
              lineHeight: 1,
              color: TITLE_PURPLE,
            }}
          >
            WEB DEVELOPMENT PORTFOLIO
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bebas Neue", data: bebasNeue, style: "normal", weight: 400 }],
    }
  );
}
