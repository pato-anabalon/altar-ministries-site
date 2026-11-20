import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getHistory, getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about/history">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ locale, href: "/about/history", title: t("history"), description: getPage("history", locale).intro });
}

/** Our History: the church's milestones in order (undated ones last until confirmed). */
export default async function HistoryPage({ params }: PageProps<"/[locale]/about/history">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("history", locale);
  const milestones = getHistory(locale);
  const t = await getTranslations("about");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} parent={{ href: "/about", label: t("parent") }} />
      <Section surface="white" aria-label={t("history")}>
        <Container>
          <ol className="border-b border-rule">
            {milestones.map((milestone) => (
              <li key={milestone.id} className="border-t border-rule">
                <Reveal className="grid gap-3 py-10 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-10">
                  {milestone.date ? (
                    <time dateTime={milestone.date} className="pt-[0.2em] font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-none uppercase">
                      {milestone.dateLabel}
                    </time>
                  ) : (
                    <span className="type-ui text-muted">{milestone.dateLabel}</span>
                  )}
                  <p className="type-lead measure">{milestone.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  );
}
