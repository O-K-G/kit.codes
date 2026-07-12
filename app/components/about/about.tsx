import ContentSection from "@components/contentSection/contentSection";
import { CONTENT } from "./about.constants";
import Badges from "./badges";

export default function About() {
  return <ContentSection {...CONTENT} slot={<Badges />} />;
}
