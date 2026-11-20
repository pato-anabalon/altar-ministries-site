import { getTranslations } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Photo } from "@/components/atoms/Photo";
import { Section } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { Reveal } from "@/components/molecules/Reveal";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getMinistries, getPage, getPhoto } from "@/lib/content";

/** Every team named as one flowing line of links, beside the worship team. */
export async function MinistriesTeaser({ locale }: { locale: Locale }) {
  const ministries = getMinistries(locale);
  const page = getPage("ministries", locale);
  const photo = getPhoto("worship-team", locale);
  const t = await getTranslations("home");

  return (
    <Section aria-labelledby="ministries-title">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <Reveal variant="photo" className="max-w-md lg:col-span-5 lg:max-w-none">
            <Photo src={photo.src} alt={photo.alt} sizes="(min-width: 1024px) 36vw, (min-width: 448px) 448px, 100vw" />
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <h2 id="ministries-title" className="type-h2">
                {page.title}
              </h2>
              {page.intro && <p className="mt-4 type-lead measure text-muted">{page.intro}</p>}
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-serif text-[clamp(1.5rem,1.2rem+1.1vw,2.25rem)] leading-snug">
                {ministries.map((ministry, index) => (
                  <li key={ministry.id} className="flex items-baseline gap-3">
                    <Link
                      href={{ pathname: "/ministries/[slug]", params: { slug: ministry.slug } }}
                      className="decoration-1 underline-offset-[0.18em] transition-colors duration-300 hover:text-accent hover:underline"
                    >
                      {ministry.name}
                    </Link>
                    {index < ministries.length - 1 && (
                      <span aria-hidden className="text-muted">
                        ·
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <TextLink href="/ministries" className="mt-10 inline-block type-ui">
                {t("ministriesCta")}
              </TextLink>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
