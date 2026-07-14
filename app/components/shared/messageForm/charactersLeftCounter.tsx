import { parseLabel } from "@utils/parseLabel";
import styles from "./charactersLeftCounter.module.css";
import { DirTypes } from "./messageForm";
import Typography from "@ui/typography/typography";

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
    <Typography
      component="span"
      color="paper"
      dir={dir}
      className={styles.counter}
      {...rest}
    >
      {charactersLeft}
    </Typography>
  );
}
