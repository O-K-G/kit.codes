import type { Metadata } from "next";
import { connection } from "next/server";
import "./globals.css";
import Nav from "@components/nav/nav";
import { FONTS_VARIABLES } from "@utils/handleFonts";
import { APP_META } from "@constants/appMeta";

export const metadata: Metadata = APP_META;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();

  return (
    <html lang="en" className={FONTS_VARIABLES}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
