import { getTranslations } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { Reveal } from "@/components/molecules/Reveal";
import type { Locale } from "@/i18n/routing";
import { getPage, getValues } from "@/lib/content";

/** Our DNA on green: the six values set large in Mon Cheri capitals, each with its line. */
export async function ValuesBand({ locale }: { locale: Locale }) {
  const values = getValues(locale);
  const page = getPage("dna", locale);
  const t = await getTranslations("home");

  return (
    <Section surface="green" aria-labelledby="values-title">
      <Container>
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <Reveal>
            <h2 id="values-title" className="type-h2">
              {page.title}
            </h2>
            {page.intro && <p className="mt-4 type-lead text-muted">{page.intro}</p>}
          </Reveal>
          <Reveal>
            <TextLink href="/about/dna" className="type-ui">
              {t("valuesCta")}
            </TextLink>
          </Reveal>
        </div>
        <dl className="mt-14 grid gap-x-12 gap-y-12 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16">
          {values.map((value, index) => (
            <Reveal key={value.id} delay={(index % 3) * 0.08} className="grid content-start gap-4 border-t border-rule pt-6">
              {/* Sized so the longest value (EXPERIENTIAL, 12 capitals) fits its column at every width. */}
              <dt className="font-display text-[clamp(1.75rem,0.9rem+2.4vw,2.25rem)] leading-none uppercase pt-[0.2em] sm:text-[clamp(1.5rem,0.6rem+2vw,2.25rem)]">
                {value.name}
              </dt>
              <dd className="type-body text-muted">{value.description}</dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
