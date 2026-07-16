import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import "./globals.css";
import Nav from "@components/nav/nav";
import StructuredData from "@components/structuredData/structuredData";
import { FONTS_VARIABLES } from "@utils/handleFonts";
import { APP_META } from "@constants/appMeta";
import SkipLink from "@ui/skipLink/skipLink";

export const metadata: Metadata = APP_META;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0e1a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();

  return (
    <html lang="en" className={FONTS_VARIABLES}>
      <body>
        <SkipLink />
        <Nav />
        {children}
        <StructuredData />
      </body>
    </html>
  );
}
