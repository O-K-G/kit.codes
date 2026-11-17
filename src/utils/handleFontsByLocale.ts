import localFont from 'next/font/local';

/*
 * The fonts are WOFF2, subset to the characters their language needs (Latin for the English ones, Hebrew
 * and Latin for the Hebrew ones and those both use), keeping all their OpenType features, variable axes
 * and name records (copyright and license as in the originals; names too, but for the two fonts whose
 * license reserves their name for the original: their modified versions are renamed). Made from the original TTF/WOFF
 * files with fontTools' pyftsubset (--flavor=woff2 --layout-features='*' --name-IDs='*', and Google
 * Fonts' "latin" and "hebrew" Unicode ranges). Each font's license is next to it.
 *
 * Only the font both languages use (Bebas Neue) is preloaded: preloading is the same on every page, so
 * preloading the others would make each page download the other language's fonts too. They're fetched
 * as soon as the page uses them instead.
 */

const bebasNeue = localFont({
  src: '../assets/fonts/Bebas_Neue/BebasNeue-Regular.woff2',
  variable: '--font-bebas-neue',
});

const montserrat = localFont({
  src: '../assets/fonts/Montserrat/Montserrat-VariableFont_wght.woff2',
  variable: '--font-montserrat',
  preload: false,
});

/** https://www.fontspace.com/just-in-the-firestorm-font-f31017 */
const justInTheFirestormRegular = localFont({
  src: '../assets/fonts/JustInTheFirestorm/JustInTheFirestormRegular.woff2',
  variable: '--font-just-in-the-firestorm',
  preload: false,
});

/** https://www.fontspace.com/stardate-81316-font-f28430  */
const starDate81316 = localFont({
  src: '../assets/fonts/Stardate81316/Stardate81316.woff2',
  variable: '--font-star-date-81316',
  preload: false,
});

/** Stopmotion, subset and renamed: its license reserves its name for the original */
const motionDisplayWeb = localFont({
  src: '../assets/fonts/Motion_Display_Web/MotionDisplayWeb-Regular.woff2',
  variable: '--font-motion-display-web',
  preload: false,
});

const karantinaRegular = localFont({
  src: '../assets/fonts/Karantina/Karantina-Regular.woff2',
  variable: '--font-karantina-regular',
  preload: false,
});

/** Varela Round, subset and renamed: its license reserves its name for the original */
const roundSansWeb = localFont({
  src: '../assets/fonts/Round_Sans_Web/RoundSansWeb-Regular.woff2',
  variable: '--font-round-sans-web',
  preload: false,
});

const handjet = localFont({
  src: '../assets/fonts/Handjet/Handjet-VariableFont_ELGR,ELSH,wght.woff2',
  variable: '--font-handjet',
  preload: false,
});

export default function handleFontsByLocale() {
  const fontsByLocale = {
    en: {
      mainTitle: justInTheFirestormRegular.variable,
      borderTitle: starDate81316.variable,
      infoText: bebasNeue.variable,
      regularText: montserrat.variable,
      shenanigansText: handjet.variable,
    },
    he: {
      mainTitle: motionDisplayWeb.variable,
      borderTitle: karantinaRegular.variable,
      infoText: bebasNeue.variable,
      regularText: roundSansWeb.variable,
      shenanigansText: handjet.variable,
    },
  } as const;

  return { fontsByLocale };
}
