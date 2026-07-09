import Badge from "@ui/badge/badge";

export const EYEBROW = "3 · Projects";
export const TITLE = "Four storefronts, still open.";
export const LINK_LABEL = "View project →";
export const LABEL = "Open";
export const BREAKING_LETTER = "e";
export const CARDS = [
  {
    leftSlot: "Unit 3A",
    rightSlot: <Badge rotate="left" label={LABEL} />,
    title: "Xdfgsfg",
    subtitle:
      "Aadfrwsg rgertey ethbetytr-rg edrgtwwgrt - gwrgrgrrg gr gergr ege trhethe hteth",
    badges: ["JavaScript", "TypeScript", "CSS"],
    href: "https://www.google.com",
  },
  {
    leftSlot: "Unit 3B",
    rightSlot: <Badge rotate="left" label={LABEL} />,
    title: "Asgfrwgrweg",
    subtitle:
      "Aadfrwsg rgertey ethbestytr-rg ergtwwgrt - gwrgrgrrg gr gergr ege trhethe hteth",
    badges: ["JavaScript", "TypeScript", "CSS"],
    href: "https://www.google.com",
  },
  {
    leftSlot: "Unit 3C",
    rightSlot: (
      <Badge
        rotate="left"
        label={LABEL}
        breakingLetter={BREAKING_LETTER}
        letterBlink
        borderBlink
      />
    ),
    title: "Ssrgrewyretgy wefgwertg wg",
    subtitle:
      "Aadfrwsg rgertfey ethbetytr-rg ergtwwgrt - gwrgrgrrg gr gergr ege trhethe hteth",
    badges: ["JavaScript", "TypeScript", "CSS"],
    href: "https://www.google.com",
  },
  {
    leftSlot: "Unit 3D",
    rightSlot: <Badge rotate="left" label={LABEL} />,
    title: "Qsfg dghet hh",
    subtitle:
      "Aadfrwsg rgertey ethbegtytr-rg ergtwwgrt - gwrgrgrrg gr gergr ege trhethe hteth",
    badges: ["JavaScript", "TypeScript", "CSS"],
    href: "https://www.google.com",
  },
];
