import Card from "@ui/card/card";
import ContentSection from "@components/contentSection/contentSection";
import List from "@ui/list/list";
import styles from "./experience.module.css";

const CONTENT = {
  eyebrow: "2 · Experience",
  title: "Building directory",
  paragraph: "A tenant list, top to bottom.",
};

export default function Experience() {
  return (
    <ContentSection
      {...CONTENT}
      slot={
        <ul className={styles.cardList}>
          <Card
            component="li"
            leftBorder="window"
            leftSlot="adfwrgrweg"
            leftSlotColor="mist"
            rightSlot="9999 — Present"
            title="XX SDFG sdgfrsgerg ethrethyrt hrethyrthyurgb eargtyehyrte"
            subtitle="srgerg ethrethryu ruhjry6uj5yj 5et7yju"
          >
            <List
              data={[
                "sgerg erghhe ethethye therhyyrt6eh4rhr trtbhrtbhyrtyryrr6t yhr66r",
                "sgerg erghhe ethethyethertbhrtbhyrtyryrr6tuyryhr66r",
                "sgerg erghhe ethet hyet herhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhy herhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhyherhyyrt6eh4rhrt rtbhrtbhy rtyryrr adf6tuyryhr66r",
              ]}
            />
          </Card>

          <Card
            component="li"
            leftBorder="window"
            leftSlot="adfwrgrweg"
            leftSlotColor="mist"
            rightSlot="9999 — Present"
            title="XX SDFG sdgfrsgerg ethrethyrt hrethyrthyurgb eargtyehyrte"
            subtitle="srgerg ethrethryu ruhjry6uj5yj 5et7yju"
          >
            <List
              data={[
                "sgerg erghhe ethethye therhyyrt6eh4rhr trtbhrtbhyrtyryrr6t yhr66r",
                "sgerg erghhe ethethyethertbhrtbhyrtyryrr6tuyryhr66r",
                "sgerg erghhe ethet hyetherhyyrt6eh4rhrt rtbhrtbhyrtyryrr adf6tuyryhr66r",
              ]}
            />
          </Card>
          <Card
            component="li"
            leftBorder="window"
            leftSlot="adfwrgrweg"
            leftSlotColor="mist"
            rightSlot="9999 — Present"
            title="XX SDFG sdgfrsgerg ethrethyrt hrethyrthyurgb eargtyehyrte"
            subtitle="srgerg ethrethryu ruhjry6uj5yj 5et7yju"
          >
            <List
              data={[
                "sgerg erghhe ethethye therhyyrt6eh4rhr trtbhrtbhyrtyryrr6t yhr66r",
                "sgerg erghhe ethethyethertbhrtbhyrtyryrr6tuyryhr66r",
                "sgerg erghhe ethet hyetherhyyrt6eh4rhrt rtbhrtbhyrtyryrr adf6tuyryhr66r",
              ]}
            />
          </Card>
          <Card
            component="li"
            leftBorder="signage"
            leftSlot="adfwrgrweg"
            leftSlotColor="mist"
            rightSlot="9999 — Present"
            title="XX SDFG sdgfrsgerg ethrethyrt hrethyrthyurgb eargtyehyrte"
            subtitle="srgerg ethrethryu ruhjry6uj5yj 5et7yju"
          />
        </ul>
      }
    />
  );
}
