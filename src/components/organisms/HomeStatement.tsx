import { getTranslations } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Photo } from "@/components/atoms/Photo";
import { Section } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { Reveal } from "@/components/molecules/Reveal";
import type { Locale } from "@/i18n/routing";
import { getPage, getPhoto } from "@/lib/content";

/** What an Experience is, in the church's own words, beside two real moments of worship. */
export async function HomeStatement({ locale }: { locale: Locale }) {
  const page = getPage("home", locale);
  const t = await getTranslations("header");
  const wide = getPhoto("worship-rose-window", locale);
  const close = getPhoto("hands-raised", locale);

  return (
    <Section aria-labelledby="home-statement">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <h2 id="home-statement" className="font-serif text-[clamp(2.125rem,1.5rem+2.6vw,3.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
                {page.statement}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 type-lead measure text-muted">{page.statementBody}</p>
              <TextLink href="/visit" className="mt-8 inline-block type-ui">
                {t("planVisit")}
              </TextLink>
            </Reveal>
          </div>
          <div className="grid grid-cols-12 items-start gap-3 sm:gap-4 lg:col-span-6">
            <Reveal variant="photo" className="col-span-7">
              <Photo src={wide.src} alt={wide.alt} sizes="(min-width: 1024px) 26vw, 58vw" />
            </Reveal>
            <Reveal variant="photo" delay={0.15} className="col-span-5 mt-[38%]">
              <Photo src={close.src} alt={close.alt} sizes="(min-width: 1024px) 18vw, 42vw" />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
