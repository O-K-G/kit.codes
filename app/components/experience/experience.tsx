import Card from "@ui/card/card";
import ContentSection from "@components/contentSection/contentSection";
import List from "@ui/list/list";
import styles from "./experience.module.css";
import { CARDS, CONTENT } from "./experience.constants";

export default function Experience() {
  return (
    <ContentSection
      {...CONTENT}
      slot={
        <ul className={styles.cardList}>
          {CARDS.map(({ rightSlot, list, ...rest }, index) => {
            const isLast = CARDS.length === index + 1;
            const leftBorder = isLast ? "signage" : "window";

            return (
              <Card
                key={rightSlot}
                leftBorder={leftBorder}
                rightSlot={rightSlot}
                component="li"
                leftSlotColor="mist"
                {...rest}
              >
                {list && <List data={list} />}
              </Card>
            );
          })}
        </ul>
      }
    />
  );
}
