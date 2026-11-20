import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Photo } from "@/components/atoms/Photo";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getCommunity, getPage, getPhoto } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/community">) {
  const locale = (await params).locale as Locale;
  const page = getPage("community", locale);
  return pageMetadata({ locale, href: "/community", title: page.title, description: page.intro });
}

/** Community support: every programme the church runs, and how to receive or help. */
export default async function CommunityPage({ params }: PageProps<"/[locale]/community">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("community", locale);
  const programmes = getCommunity(locale);
  const photo = getPhoto("conversation", locale);
  const t = await getTranslations("community");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />

      <Section surface="white" aria-label={page.title}>
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <dl className="border-b border-rule lg:col-span-7">
              {programmes.map((programme) => (
                <Reveal key={programme.id} className="grid gap-3 border-t border-rule py-8 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-8">
                  <dt className="type-h3">{programme.title}</dt>
                  <dd className="type-body text-muted">{programme.body}</dd>
                </Reveal>
              ))}
            </dl>
            <Reveal variant="photo" className="max-w-md lg:col-span-4 lg:col-start-9 lg:max-w-none lg:self-start lg:sticky lg:top-28">
              <Photo src={photo.src} alt={photo.alt} sizes="(min-width: 1024px) 30vw, (min-width: 448px) 448px, 100vw" />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section surface="green" spacing="compact" aria-labelledby="community-help">
        <Container>
          <Reveal className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-16">
            <div>
              <h2 id="community-help" className="type-h2">
                {t("helpTitle")}
              </h2>
              <p className="mt-4 type-lead measure text-muted">{t("helpText")}</p>
            </div>
            <Button href="/contact" arrow>
              {t("helpCta")}
            </Button>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
