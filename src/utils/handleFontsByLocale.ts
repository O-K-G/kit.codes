import localFont from 'next/font/local';

const bebasNeue = localFont({
  src: '../../public/fonts/Bebas_Neue/BebasNeue-Regular.ttf',
  variable: '--font-bebas-neue',
});

const montserrat = localFont({
  src: '../../public/fonts/Montserrat/Montserrat-VariableFont_wght.ttf',
  variable: '--font-montserrat',
});

/** https://www.fontspace.com/just-in-the-firestorm-font-f31017 */
const justInTheFirestormRegular = localFont({
  src: '../../public/fonts/JustInTheFirestormRegular-z291.ttf',
  variable: '--font-just-in-the-firestorm',
});

/** https://www.fontspace.com/stardate-81316-font-f28430  */
const starDate81316 = localFont({
  src: '../../public/fonts/Stardate81316-aolE.ttf',
  variable: '--font-star-date-81316',
});

const stopMotion = localFont({
  src: '../../public/fonts/stop-motion/stopmotiondecember11-webfont.woff',
  variable: '--font-stop-motion',
});

const karantinaRegular = localFont({
  src: '../../public/fonts/Karantina/Karantina-Regular.ttf',
  variable: '--font-karantina-regular',
});

const varelaRound = localFont({
  src: '../../public/fonts/Varela_Round/VarelaRound-Regular.ttf',
  variable: '--font-varela-round-regular',
});

const handjet = localFont({
  src: '../../public/fonts/Handjet/Handjet-VariableFont_ELGR,ELSH,wght.ttf',
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
      mainTitle: stopMotion.variable,
      borderTitle: karantinaRegular.variable,
      infoText: bebasNeue.variable,
      regularText: varelaRound.variable,
      shenanigansText: handjet.variable,
    },
  } as const;

  return { fontsByLocale };
}
