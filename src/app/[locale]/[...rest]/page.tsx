import { notFound } from "next/navigation";

/** The locale layout turns dynamic params off; every path here is unknown by design, so keep them on. */
export const dynamicParams = true;

/** Unknown paths under a locale render the localized not-found page. */
export default function CatchAllPage() {
  notFound();
}
