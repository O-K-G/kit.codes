'use client'

import { useFadeIn } from "@hooks/useFadeIn";

type SectionObserverProps = {
  id: string;
};

export default function SectionObserver({ id }: SectionObserverProps) {
  useFadeIn({ id });

  return null;
}
