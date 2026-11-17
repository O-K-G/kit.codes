import Home from "@components/home/Home";
import { setPageLocale } from "@i18n/pageLocale";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  await setPageLocale(params);
  return <Home />;
}
