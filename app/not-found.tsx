import Errors from "@components/errors/errors";
import { LABEL } from "./not-found.constants";

export default function NotFound() {
  return <Errors label={LABEL} />;
}
