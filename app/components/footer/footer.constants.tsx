import { URLS } from "@/app/page.constants";
import AnchorTag from "@/app/ui/anchorTag/anchorTag";

export const LABEL = (
  <>
    Thanks for stopping by — building last renovated 2026, and you can check my
    old deprecated site over&nbsp;
    <AnchorTag href={URLS.oldSite}>here</AnchorTag>
  </>
);
