import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getPage, getPolicies } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/resources/policies">) {
  const locale = (await params).locale as Locale;
  const page = getPage("policies", locale);
  return pageMetadata({ locale, href: "/resources/policies", title: page.title, description: page.intro });
}

/** Governance framework: each policy with its documents (EN/ES) once approved by the client. */
export default async function PoliciesPage({ params }: PageProps<"/[locale]/resources/policies">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("policies", locale);
  const policies = getPolicies(locale);
  const t = await getTranslations("policies");
  const tResources = await getTranslations("nav");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} parent={{ href: "/resources", label: tResources("resources") }} />
      <Section surface="white" spacing="compact" aria-label={page.title}>
        <Container>
          <ul className="border-b border-rule">
            {policies.map((policy) => (
              <li key={policy.id} className="border-t border-rule">
                <Reveal className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2 py-6">
                  <h2 className="font-serif text-[clamp(1.375rem,1.2rem+0.8vw,1.875rem)] leading-tight">{policy.name}</h2>
                  {policy.files.length === 0 ? (
                    <p className="type-small text-muted">{t("documentSoon")}</p>
                  ) : (
                    <p className="flex gap-4 type-ui">
                      {policy.files.map((file) => (
                        <a key={file.url} href={file.url} hrefLang={file.language} className="underline decoration-1 underline-offset-[0.22em] hover:text-muted">
                          {file.label} · {file.language.toUpperCase()}
                        </a>
                      ))}
                    </p>
                  )}
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
