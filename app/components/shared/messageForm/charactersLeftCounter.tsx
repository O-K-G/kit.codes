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
  id?: string;
};

export default function CharactersLeftCounter({
  counter,
  label,
  maxLength,
  dir,
  id,
  ...rest
}: CharactersLeftCounterProps) {
  const currentParsedLabel = parseLabel(label);
  const count =
    (counter[currentParsedLabel as keyof typeof counter] as string)?.length ||
    0;
  const charactersLeft = `${maxLength - count} ${CHARACTERS_LEFT}`;

  return (
    // Claude PR: this counter updated on every keystroke but was never announced to
    // screen readers and wasn't associated with its field. Added an id (referenced via
    // aria-describedby on the matching input in messageForm.tsx) and aria-live="polite"
    // so assistive tech picks up the remaining-character count as it changes.
    <Typography
      component="span"
      color="paper"
      dir={dir}
      id={id}
      aria-live="polite"
      className={styles.counter}
      {...rest}
    >
      {charactersLeft}
    </Typography>
  );
}
