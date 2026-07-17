import localFont from "next/font/local";

const _bigShoulders = localFont({
  src: "../../public/fonts/Big_Shoulders/BigShoulders-VariableFont_opsz,wght.woff2",
  declarations: [{ prop: "font-family", value: "Big Shoulders" }],
  preload: false,
});

const _inter = localFont({
  src: [
    {
      path: "../../public/fonts/Inter/Inter-VariableFont_opsz,wght.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  declarations: [{ prop: "font-family", value: "Inter" }],
  preload: false,
});

const _jetBrainsMono = localFont({
  src: "../../public/fonts/JetBrains_Mono/JetBrainsMono-VariableFont_wght.woff2",
  declarations: [{ prop: "font-family", value: "JetBrains Mono" }],
  preload: false,
});

export const FONTS_VARIABLES = "";
