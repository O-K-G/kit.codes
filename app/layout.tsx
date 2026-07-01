import type { Metadata } from "next";
import "./globals.css";
import Nav from "@components/nav/nav";
import { FONTS_VARIABLES } from "@utils/handleFonts";
import { APP_META } from "@constants/appMeta";

export const metadata: Metadata = APP_META;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={FONTS_VARIABLES}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
