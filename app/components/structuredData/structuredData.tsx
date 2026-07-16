import { headers } from "next/headers";
import { PERSON_JSON_LD } from "@constants/appMeta";

export default async function StructuredData() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
    />
  );
}
