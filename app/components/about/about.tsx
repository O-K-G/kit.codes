import ContentSection from "@components/contentSection/contentSection";

const CONTENT = {
  eyebrow: "1 · About",
  title: "The foundation",
  paragraph: (
    <>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor <b>incididunt ut labore</b> et dolore magna aliqua. Ut enim ad
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
      ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </>
  ),
};

export default function About() {
  return <ContentSection {...CONTENT} />;
}
