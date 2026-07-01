import localFont from "next/font/local";

const _bigShoulders = localFont({
  src: "../../public/fonts/Big_Shoulders/BigShoulders-VariableFont_opsz,wght.ttf",
  declarations: [{ prop: "font-family", value: "Big Shoulders" }],
});

const _inter = localFont({
  src: [
    {
      path: "../../public/fonts/Inter/Inter-VariableFont_opsz,wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  declarations: [{ prop: "font-family", value: "Inter" }],
});

const _jetBrainsMono = localFont({
  src: [
    {
      path: "../../public/fonts/JetBrains_Mono/JetBrainsMono-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/JetBrains_Mono/JetBrainsMono-Italic-VariableFont_wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  declarations: [{ prop: "font-family", value: "JetBrains Mono" }],
});

export const FONTS_VARIABLES = "";
