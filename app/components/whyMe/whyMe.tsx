import styles from "./whyMe.module.css";
import Card from "@ui/card/card";
import ContentSection from "@components/contentSection/contentSection";
import Badge from "@ui/badge/badge";
import { CARDS, EYEBROW, TITLE } from "./whyMe.constants";
import { SECTION_IDS } from "@/app/page.constants";

export default function WhyMe() {
  return (
    <ContentSection
      id={SECTION_IDS.whyMe}
      eyebrow={EYEBROW}
      title={TITLE}
      slot={
        <ul className={styles.cardList}>
          {CARDS.map(({ leftSlot, badges, ...rest }) => (
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
            </Card>
          ))}
        </ul>
      }
    />
  );
}
