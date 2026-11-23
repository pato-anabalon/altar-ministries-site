import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/atoms/Container";
import { Placeholder } from "@/components/atoms/Placeholder";
import { Section } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getGlobal, getPage, isPageLive } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/global/churches">) {
  const locale = (await params).locale as Locale;
  const page = getPage("churches", locale);
  return pageMetadata({ locale, href: "/global/churches", title: page.title, description: page.intro });
}

/** Our churches (phase 2): the formally established churches, each with its place and link once approved. */
export default async function ChurchesPage({ params }: PageProps<"/[locale]/global/churches">) {
  if (!isPageLive("churches")) notFound();
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("churches", locale);
  const { churches } = getGlobal(locale);
  const t = await getTranslations("churches");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} parent={{ href: "/global", label: tNav("global") }} />

      <Section surface="white" spacing="compact" aria-labelledby="churches-title">
        <Container>
          <h2 id="churches-title" className="sr-only">
            {page.title}
          </h2>
          {churches.length === 0 ? (
            <Reveal>
              <Placeholder label={t("pending")} ratio="auto" className="min-h-72" />
            </Reveal>
          ) : (
            <ul className="border-b border-rule">
              {churches.map((church) => (
                <li key={church.id} className="border-t border-rule">
                  <Reveal className="grid gap-4 py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
                    <div className="grid content-start gap-2">
                      <h3 className="font-serif text-[clamp(1.625rem,1.2rem+1.4vw,2.5rem)] leading-tight">{church.name}</h3>
                      <p className="type-small text-muted">{church.location}</p>
                    </div>
                    <div className="grid content-start justify-items-start gap-4">
                      {church.summary && <p className="type-body measure text-muted">{church.summary}</p>}
                      {church.url && (
                        <TextLink externalHref={church.url} className="type-ui">
                          {t("visit")}
                        </TextLink>
                      )}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
