import { SKILLS_LISTS } from "@constants/skillsLists";
import { SkillBlockProps, SkillsListRowProps } from "@constants/interfaces";
import styles from "./SkillsList.module.css";

const CLASSNAME_BY_ROW = {
  row1: styles.row1,
  row2: styles.row2,
  row3: styles.row3,
  row4: styles.row4,
  mobileRow: styles.mobileRow,
} as const;

function Row({ children, className = "" }: SkillsListRowProps) {
  return (
    <ul dir="ltr" className={`${styles.row} ${className}`}>
      {children}
    </ul>
  );
}

function SkillBlock({
  str,
  "data-visible-mobile": visibleMobile,
}: SkillBlockProps) {
  return (
    <li
      data-visible-mobile={visibleMobile}
    >
      {str}
    </li>
  );
}

export default function SkillsList() {
  return SKILLS_LISTS.map((row) => {
    const key = Object.keys(row)[0];
    const rowItems = row[key as keyof typeof row] as string[];
    const rowClassName =
      CLASSNAME_BY_ROW[key as keyof typeof CLASSNAME_BY_ROW];

    return (
      <Row key={`skills-${key}`} className={rowClassName}>
        {rowItems.map((str: string) => (
          <SkillBlock
            data-visible-mobile={key === "mobileRow" && str === rowItems[3]}
            key={`skill-item-${str}`}
            str={str}
          />
        ))}
      </Row>
    );
  });
}
