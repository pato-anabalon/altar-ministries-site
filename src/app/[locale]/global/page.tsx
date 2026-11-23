import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getGlobal, getPage, isPageLive } from "@/lib/content";
import { phase2Nav } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/global">) {
  const locale = (await params).locale as Locale;
  const page = getPage("global", locale);
  return pageMetadata({ locale, href: "/global", title: page.title, description: page.intro });
}

/**
 * Global: Altar beyond Ponsonby on one page (each area has a single paragraph so far, so they are
 * sections, not sub-pages): the global community, Altar Global, missions, and partners in faith.
 */
export default async function GlobalPage({ params }: PageProps<"/[locale]/global">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("global", locale);
  const global = getGlobal(locale);
  const t = await getTranslations("global");
  const tHome = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const areas = [global.community, global.altarGlobal, global.missions];
  // Our churches and supporters, once live (phase 2).
  const more = phase2Nav
    .filter((item) => item.href.startsWith("/global/") && isPageLive(item.key))
    .map((item) => ({ href: item.href, ...getPage(item.key, locale) }));

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />

      <Section surface="white" aria-label={page.title}>
        <Container>
          <ul className="border-b border-rule">
            {areas.map((area) => (
              <li key={area.title} className="border-t border-rule">
                <Reveal className="grid gap-4 py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
                  <h2 className="font-serif text-[clamp(1.625rem,1.2rem+1.4vw,2.5rem)] leading-tight">{area.title}</h2>
                  <p className="type-lead measure text-muted">{area.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {global.partners.length > 0 && (
        <Section spacing="compact" aria-labelledby="global-partners">
          <Container>
            <Reveal>
              <h2 id="global-partners" className="type-h2">
                {t("partners")}
              </h2>
            </Reveal>
            <ul className="mt-10 border-b border-rule">
              {global.partners.map((partner) => (
                <li key={partner.id} className="border-t border-rule">
                  <Reveal className="grid gap-2 py-7 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
                    <h3 className="type-h3">
                      {partner.url ? (
                        <a href={partner.url} target="_blank" rel="noopener noreferrer" className="underline decoration-1 underline-offset-[0.22em] hover:text-muted">
                          {partner.name}
                        </a>
                      ) : (
                        partner.name
                      )}
                    </h3>
                    <p className="type-body measure text-muted">{partner.description ?? tCommon("comingSoon")}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {more.length > 0 && (
        <Section surface="white" spacing="compact" aria-labelledby="global-more">
          <Container>
            <Reveal>
              <h2 id="global-more" className="type-h2">
                {t("moreTitle")}
              </h2>
            </Reveal>
            <ul className="mt-10 border-b border-rule">
              {more.map((item) => (
                <li key={item.href} className="border-t border-rule">
                  <Link href={item.href} className="group flex items-center justify-between gap-6 py-7">
                    <span className="grid gap-1">
                      <span className="font-serif text-[clamp(1.5rem,1.2rem+1.1vw,2.25rem)] leading-tight">{item.title}</span>
                      {item.intro && <span className="type-small measure text-muted">{item.intro}</span>}
                    </span>
                    <ArrowRight aria-hidden strokeWidth={1.25} className="size-7 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-2" />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section surface="green" spacing="compact" aria-labelledby="global-connected">
        <Container>
          <Reveal className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-16">
            <div>
              <h2 id="global-connected" className="type-h2">
                {t("stayConnected")}
              </h2>
              <p className="mt-4 type-lead measure text-muted">{t("stayConnectedText")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/resources/newsletters" arrow>
                {tHome("newsletterCta")}
              </Button>
              <Button href="/contact" variant="secondary">
                {tCommon("getInTouch")}
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
