import { ReactNode } from "react";
import ScrollableSubsectionContainer from "@ui/scrollableSection/ScrollableSubsectionContainer";
import { ScrollableSubsectionItem } from "@ui/scrollableSection/ScrollableSubsectionItem";

export {
  LEFT_BUTTON_TEST_ID,
  RIGHT_BUTTON_TEST_ID,
} from "@ui/scrollableSection/ScrollableSubsectionContainer";

export default function ScrollableSubsection({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ScrollableSubsectionContainer>{children}</ScrollableSubsectionContainer>
  );
}

ScrollableSubsection.Item = ScrollableSubsectionItem;
