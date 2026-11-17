"use client";

import { ReactNode, useContext } from "react";
import { AsideContext } from "@components/contact/AsideDrawer";

/** Mounts its children only while the contact drawer is open. */
export default function AsideOpenContent({ children }: { children: ReactNode }) {
  const { open } = useContext(AsideContext);

  return open ? children : null;
}
