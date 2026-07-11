import styles from "./projects.module.css";
import Card from "@ui/card/card";
import ContentSection from "@components/contentSection/contentSection";
import Badge from "@ui/badge/badge";
import AnchorTag from "@ui/anchorTag/anchorTag";
import { CARDS, EYEBROW, LINK_LABEL, TITLE } from "./projects.constants";
import { SECTION_IDS } from "@/app/page.constants";

export default function Projects() {
  return (
    <ContentSection
      id={SECTION_IDS.projects}
      eyebrow={EYEBROW}
      title={TITLE}
      slot={
        <ul className={styles.cardList}>
          {CARDS.map(({ leftSlot, badges, href, ...rest }) => (
            <Card
              key={leftSlot}
              hoverEffect
              leftSlot={leftSlot}
              component="li"
              leftSlotColor="mist"
              {...rest}
            >
              <div className={styles.badgeContainer}>
                {badges.map((str) => (
                  <Badge
                    key={`badge-${leftSlot}-${str}`}
                    color="mist"
                    borderColor="block-border"
                    label={str}
                  />
                ))}
              </div>

              <AnchorTag href={href}>{LINK_LABEL}</AnchorTag>
            </Card>
          ))}
        </ul>
      }
    />
  );
}
