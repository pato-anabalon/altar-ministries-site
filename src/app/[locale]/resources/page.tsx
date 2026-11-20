import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getPage, getResourceCategories } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/resources">) {
  const locale = (await params).locale as Locale;
  const page = getPage("resources", locale);
  return pageMetadata({ locale, href: "/resources", title: page.title, description: page.intro });
}

/**
 * Resources: sermons, audio, audiobooks and PDFs, each listing its files (paired EN/ES) once the
 * client supplies them; until then each kind says so. Links on to the newsletter and policies.
 */
export default async function ResourcesPage({ params }: PageProps<"/[locale]/resources">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("resources", locale);
  const categories = getResourceCategories(locale);
  const t = await getTranslations("resources");
  const more = [
    { href: "/resources/newsletters", title: getPage("newsletters", locale).title, intro: getPage("newsletters", locale).intro },
    { href: "/resources/policies", title: getPage("policies", locale).title, intro: getPage("policies", locale).intro },
  ] as const;

  return (
    <>
      <PageHeader title={page.title} intro={page.intro}>
        <Button externalHref={site.streamUrl} arrow>
          {t("watchCta")}
        </Button>
      </PageHeader>

      <Section surface="white" aria-label={page.title}>
        <Container>
          <ul className="border-b border-rule">
            {categories.map((category) => (
              <li key={category.id} className="border-t border-rule">
                <Reveal className="grid gap-4 py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
                  <h2 className="font-serif text-[clamp(1.625rem,1.2rem+1.4vw,2.5rem)] leading-tight">{category.name}</h2>
                  <div className="grid content-start gap-3">
                    <p className="type-lead measure">{category.description}</p>
                    {category.files.length === 0 ? (
                      <p className="type-small text-muted">{t("filesSoon")}</p>
                    ) : (
                      <ul className="grid gap-2 type-ui">
                        {category.files.map((file) => (
                          <li key={file.url}>
                            <a href={file.url} className="underline decoration-1 underline-offset-[0.22em] hover:text-muted" hrefLang={file.language}>
                              {file.label} · {file.language.toUpperCase()}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section spacing="compact" aria-labelledby="resources-more">
        <Container>
          <Reveal>
            <h2 id="resources-more" className="type-h2">
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
    </>
  );
}
