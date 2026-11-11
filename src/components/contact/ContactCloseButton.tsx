"use client";

import { ReactNode, useContext } from "react";
import { AsideContext } from "@components/contact/AsideDrawer";
import ContactGoBackButton from "@components/contact/ContactGoBackButton";

export default function ContactCloseButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { onClose } = useContext(AsideContext);

  return (
    <ContactGoBackButton onClick={onClose} className={className}>
      {children}
    </ContactGoBackButton>
  );
}
