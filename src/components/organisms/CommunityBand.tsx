import { getTranslations } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Photo } from "@/components/atoms/Photo";
import { Section } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { Reveal } from "@/components/molecules/Reveal";
import type { Locale } from "@/i18n/routing";
import { getCommunity, getPage, getPhoto } from "@/lib/content";

/** The Community Experience: what the church shares, in three concrete programmes. */
const FEATURED = ["pantry", "kids-presents", "migrant-support"];

export async function CommunityBand({ locale }: { locale: Locale }) {
  const page = getPage("community", locale);
  const programmes = getCommunity(locale).filter((item) => FEATURED.includes(item.id));
  const photo = getPhoto("conversation", locale);
  const t = await getTranslations("home");

  return (
    <Section surface="white" aria-labelledby="community-title">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <h2 id="community-title" className="type-h2">
                {page.title}
              </h2>
              {page.intro && <p className="mt-4 type-lead measure text-muted">{page.intro}</p>}
            </Reveal>
            <dl className="mt-12 grid gap-8">
              {programmes.map((programme, index) => (
                <Reveal key={programme.id} delay={index * 0.08} className="grid gap-2 border-t border-rule pt-6">
                  <dt className="type-h3">{programme.title}</dt>
                  <dd className="type-body measure text-muted">{programme.body}</dd>
                </Reveal>
              ))}
            </dl>
            <Reveal className="mt-10">
              <TextLink href="/community" className="type-ui">
                {t("communityCta")}
              </TextLink>
            </Reveal>
          </div>
          <Reveal variant="photo" className="max-w-md lg:col-span-5 lg:col-start-8 lg:max-w-none lg:self-center">
            <Photo src={photo.src} alt={photo.alt} sizes="(min-width: 1024px) 36vw, (min-width: 448px) 448px, 100vw" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
