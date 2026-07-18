import AnchorTag from "@ui/anchorTag/anchorTag";
import styles from "./skipLink.module.css";
import { LABEL, MAIN_CONTENT_ID } from "./skipLink.constants";
import { concatStyles } from "@utils/concatStyles";

type SkipLinkProps = {
  className?: string;
};

export default function SkipLink({ className = "", ...rest }: SkipLinkProps) {
  return (
    <AnchorTag
      target="_self"
      href={`#${MAIN_CONTENT_ID}`}
      className={concatStyles([styles.skipLink, className])}
      {...rest}
    >
      {LABEL}
    </AnchorTag>
  );
}
