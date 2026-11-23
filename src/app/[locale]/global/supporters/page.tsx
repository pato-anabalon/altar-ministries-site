import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/atoms/Container";
import { Placeholder } from "@/components/atoms/Placeholder";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getGlobal, getPage, isPageLive } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/global/supporters">) {
  const locale = (await params).locale as Locale;
  const page = getPage("supporters", locale);
  return pageMetadata({ locale, href: "/global/supporters", title: page.title, description: page.intro });
}

/** Supporters (phase 2): names and logos the client has permission to show, as a quiet grid. */
export default async function SupportersPage({ params }: PageProps<"/[locale]/global/supporters">) {
  if (!isPageLive("supporters")) notFound();
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("supporters", locale);
  const { supporters } = getGlobal(locale);
  const t = await getTranslations("supporters");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} parent={{ href: "/global", label: tNav("global") }} />

      <Section surface="white" spacing="compact" aria-labelledby="supporters-title">
        <Container>
          <h2 id="supporters-title" className="sr-only">
            {page.title}
          </h2>
          {supporters.length === 0 ? (
            <Reveal>
              <Placeholder label={t("pending")} ratio="auto" className="min-h-72" />
            </Reveal>
          ) : (
            <ul className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-3 lg:grid-cols-4">
              {supporters.map((supporter) => {
                const mark = supporter.logo ? (
                  <Image src={supporter.logo} alt={supporter.name} width={240} height={120} className="h-16 w-auto object-contain" />
                ) : (
                  <span className="type-h3 text-center">{supporter.name}</span>
                );
                return (
                  <li key={supporter.id} className="flex min-h-40 items-center justify-center bg-surface p-8">
                    {supporter.url ? (
                      <a href={supporter.url} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70">
                        {mark}
                      </a>
                    ) : (
                      mark
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
