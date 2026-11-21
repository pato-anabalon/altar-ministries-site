import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Plus } from "lucide-react";
import { Container } from "@/components/atoms/Container";
import { Photo } from "@/components/atoms/Photo";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getBeliefs, getPage, getPhoto } from "@/lib/content";
import { capToLongestWord } from "@/lib/fitText";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  const locale = (await params).locale as Locale;
  const page = getPage("about", locale);
  return pageMetadata({ locale, href: "/about", title: page.title, description: page.intro });
}

/** About: who we are, mission and vision, what we believe, how we are governed, where we head. */
export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("about", locale);
  const beliefs = getBeliefs(locale);
  const photo = getPhoto("worship-rose-window", locale);
  const t = await getTranslations("about");

  const explore = [
    { href: "/about/history", label: t("history"), detail: getPage("history", locale).title },
    { href: "/about/dna", label: t("dna"), detail: getPage("dna", locale).title },
    { href: "/about/leadership", label: t("leadership"), detail: getPage("leadership", locale).title },
  ] as const;
  const exploreSize = capToLongestWord("clamp(1.75rem, 1.2rem + 2vw, 3rem)", explore.map((item) => item.label));

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />

      <Section surface="white" aria-labelledby="about-who">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
            <Reveal className="lg:col-span-6">
              <h2 id="about-who" className="type-h2">
                {t("whoWeAre")}
              </h2>
              <p className="mt-6 type-lead measure text-muted">{page.whoWeAre}</p>
            </Reveal>
            <Reveal variant="photo" className="max-w-md lg:col-span-5 lg:col-start-8 lg:max-w-none">
              <Photo src={photo.src} alt={photo.alt} sizes="(min-width: 1024px) 36vw, (min-width: 448px) 448px, 100vw" />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section surface="green" aria-label={`${t("mission")} · ${t("vision")}`}>
        <Container>
          <div className="grid gap-14 md:grid-cols-2 md:gap-16">
            {[
              [t("mission"), page.mission],
              [t("vision"), page.vision],
            ].map(([title, body], index) => (
              <Reveal key={title} delay={index * 0.1} className="border-t border-rule pt-6">
                <h2 className="type-h3">{title}</h2>
                <p className="mt-6 font-serif text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-[1.25] text-balance">{body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="about-beliefs">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-4">
              <h2 id="about-beliefs" className="type-h2 lg:sticky lg:top-28">
                {t("beliefs")}
              </h2>
            </Reveal>
            <Reveal className="lg:col-span-8">
              <ul className="border-b border-rule">
                {beliefs.map((belief) => (
                  <li key={belief.id} className="border-t border-rule">
                    <details className="group">
                      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] [&::-webkit-details-marker]:hidden">
                        {belief.name}
                        <Plus aria-hidden strokeWidth={1.25} className="size-5 shrink-0 text-muted transition-transform duration-500 ease-out-expo group-open:rotate-45" />
                      </summary>
                      <p className="pb-8 type-body measure text-muted">{belief.description}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section surface="white" aria-labelledby="about-aspiration">
        <Container>
          <Reveal>
            <h2 id="about-aspiration" className="type-h3">
              {t("aspiration")}
            </h2>
            <p className="mt-6 max-w-5xl font-serif text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-[1.18] text-balance">{page.aspiration}</p>
          </Reveal>
          <Reveal className="mt-16 grid gap-4 border-t border-rule pt-8 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-10">
            <h2 className="type-h3">{t("governance")}</h2>
            <p className="type-body measure text-muted">{page.governance}</p>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="compact" aria-labelledby="about-explore">
        <Container>
          <Reveal>
            <h2 id="about-explore" className="type-h2">
              {t("explore")}
            </h2>
          </Reveal>
          <ul className="mt-10 border-b border-rule">
            {explore.map((item) => (
              <li key={item.href} className="border-t border-rule">
                <Link href={item.href} className="group flex items-center justify-between gap-6 py-7">
                  <span className="grid gap-1">
                    <span className="pt-[0.2em] font-display leading-[1.2] uppercase" style={{ fontSize: exploreSize }}>
                      {item.label}
                    </span>
                    <span className="type-small text-muted">{item.detail}</span>
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
