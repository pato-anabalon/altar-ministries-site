import { getTranslations } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { site } from "@/lib/site";

/**
 * Right under the hero: the three facts a first-time visitor needs (when, where, or online),
 * so nobody has to hunt for them after the cinematic opening.
 */
export async function InfoBar() {
  const t = await getTranslations("infoBar");
  const tFooter = await getTranslations("footer");
  const tHeader = await getTranslations("header");

  return (
    <Section spacing="none" aria-labelledby="info-bar-title" className="border-b border-rule">
      <h2 id="info-bar-title" className="sr-only">
        {t("title")}
      </h2>
      <Container>
        <dl className="grid divide-rule py-2 md:grid-cols-3 md:divide-x max-md:divide-y">
          <div className="grid content-start gap-2 py-8 md:pr-10">
            <dt className="type-small text-muted">{tFooter("gatherings")}</dt>
            <dd className="type-lead">{tFooter("sundayTimes")}</dd>
          </div>
          <div className="grid content-start gap-2 py-8 md:px-10">
            <dt className="type-small text-muted">{t("where")}</dt>
            <dd className="grid justify-items-start gap-3">
              <span className="type-lead">
                {site.venue.name}, {site.venue.streetAddress}, {site.venue.suburb}
              </span>
              <TextLink externalHref={site.venue.mapsUrl} className="type-ui">
                {t("directions")}
              </TextLink>
            </dd>
          </div>
          <div className="grid content-start gap-2 py-8 md:pl-10">
            <dt className="type-small text-muted">{t("online")}</dt>
            <dd className="grid justify-items-start gap-3">
              <span className="type-lead">{t("onlineText")}</span>
              <TextLink externalHref={site.streamUrl} className="type-ui">
                {tHeader("watchOnline")}
              </TextLink>
            </dd>
          </div>
        </dl>
      </Container>
    </Section>
  );
}
