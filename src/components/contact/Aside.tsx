import { useTranslations } from "next-intl";
import AsideDrawer from "@components/contact/AsideDrawer";
import Contact from "@components/contact/Contact";
import { ActiveSectionProps } from "@constants/interfaces";

export default function Aside({ activeSection }: ActiveSectionProps) {
  const t = useTranslations("contactGoBackButtonText");

  return (
    <AsideDrawer openButtonLabel={t("contactMe")}>
      <Contact activeSection={activeSection} />
    </AsideDrawer>
  );
}
