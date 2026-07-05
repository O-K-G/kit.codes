import { parseLabel } from "@utils/parseLabel";
import styles from "./charactersLeftCounter.module.css";
import { DirTypes } from "./messageForm";

const CHARACTERS_LEFT = "characters left";

type CharactersLeftCounterProps = {
  counter: object;
  maxLength: number;
  label: string;
  dir: DirTypes;
};

export default function CharactersLeftCounter({
  counter,
  label,
  maxLength,
  dir,
  ...rest
}: CharactersLeftCounterProps) {
  const currentParsedLabel = parseLabel(label);
  const count =
    (counter[currentParsedLabel as keyof typeof counter] as string)?.length ||
    0;
  const charactersLeft = `${maxLength - count} ${CHARACTERS_LEFT}`;

  return (
    <div dir={dir} className={styles.counter} {...rest}>
      {charactersLeft}
    </div>
  );
}
