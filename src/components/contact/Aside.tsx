import { useTranslations } from "next-intl";
import AsideDrawer from "@components/contact/AsideDrawer";
import Contact from "@components/contact/Contact";

export default function Aside() {
  const t = useTranslations("contactGoBackButtonText");

  return (
    <AsideDrawer openButtonLabel={t("contactMe")}>
      <Contact />
    </AsideDrawer>
  );
}
