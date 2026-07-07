import Card, { CardProps } from "@ui/card/card";
import ContentSection from "@components/contentSection/contentSection";
import List from "@ui/list/list";
import styles from "./experience.module.css";

const CONTENT = {
  eyebrow: "2 · Experience",
  title: "Building directory",
  paragraph: "A tenant list, top to bottom.",
};

type CardWithList = Omit<CardProps, "leftSlotColor"> & {
  list?: string[];
};

const CARDS: CardWithList[] = [
  {
    leftSlot: "adfwrgrweg",
    rightSlot: "99199 — Present",
    title: "XX SDFG sdgfrsgerg ethrethyrt hrethyrthyurgb eargtyehyrte",
    subtitle: "srgerg ethrethryu ruhjry6uj5yj 5et7yju",
    list: [
      "sgerg erghhe ethethye therhyyrt6eh4rhr trtbhrtbhyrtyryrr6t yhr66r",
      "sgerg erghhe ethethyethertbhrtbhyrtyryrr6tuyryhr66r",
      "sgerg erghhe ethet hyet herhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhy herhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhy rtyryrr adf6tuyryhr66r",
    ],
  },
  {
    leftSlot: "adfwrgrweg",
    rightSlot: "929199 — Present",
    title: "XX SDFG sdgfrsgerg ethrethyrt hrethyrthyurgb eargtyehyrte",
    subtitle: "srgerg ethrethryu ruhjry6uj5yj 5et7yju",
    list: [
      "sgerg erghhe ethethye therhyyrt6eh4rhr trtbhrtbhyrtyryrr6t yhr66r",
      "sgerg erghhe ethethyethertbhrtbhyrtyryrr6tuyryhr66r",
      "sgerg erghhe ethet hyet herhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhy herhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhy rtyryrr adf6tuyryhr66r",
    ],
  },
  {
    leftSlot: "adfwrgrweg",
    rightSlot: "991949 — Present",
    title: "XX SDFG sdgfrsgerg ethrethyrt hrethyrthyurgb eargtyehyrte",
    subtitle: "srgerg ethrethryu ruhjry6uj5yj 5et7yju",
    list: [
      "sgerg erghhe ethethye therhyyrt6eh4rhr trtbhrtbhyrtyryrr6t yhr66r",
      "sgerg erghhe ethethyethertbhrtbhyrtyryrr6tuyryhr66r",
      "sgerg erghhe ethet hyet herhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhy herhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhy rtyryrr adf6tuyryhr66r",
    ],
  },
  {
    leftSlot: "adfwrgrweg",
    rightSlot: "99399 — Present",
    title: "XX SDFG sdgfrsgerg ethrethyrt hrethyrthyurgb eargtyehyrte",
    subtitle: "srgerg ethrethryu ruhjry6uj5yj 5et7yju",
  },
];

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
                leftBorder={leftBorder}
                key={rightSlot}
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
