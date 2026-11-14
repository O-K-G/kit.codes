import { ReactNode } from "react";
import ScrollableSubsectionContainer from "@ui/scrollableSection/ScrollableSubsectionContainer";
import { ScrollableSubsectionItem } from "@ui/scrollableSection/ScrollableSubsectionItem";

export {
  LEFT_BUTTON_TEST_ID,
  RIGHT_BUTTON_TEST_ID,
} from "@ui/scrollableSection/ScrollableSubsectionContainer";

export default function ScrollableSubsection(props: {
  children: ReactNode;
  /** Names the carousel (e.g. its section's title) */
  "aria-label": string;
}) {
  return <ScrollableSubsectionContainer {...props} />;
}

ScrollableSubsection.Item = ScrollableSubsectionItem;
