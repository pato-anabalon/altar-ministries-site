import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Photo } from "@/components/atoms/Photo";
import { Placeholder } from "@/components/atoms/Placeholder";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getLeaders, getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about/leadership">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ locale, href: "/about/leadership", title: t("leadership"), description: getPage("about", locale).governance });
}

/**
 * Senior Leaders under the presbytery model: how decisions are made, the senior team (photo
 * placeholders until supplied; bios only once approved), elders and pastors in training.
 */
export default async function LeadershipPage({ params }: PageProps<"/[locale]/about/leadership">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("leadership", locale);
  const about = getPage("about", locale);
  const leaders = getLeaders(locale);
  const t = await getTranslations("leadership");
  const tAbout = await getTranslations("about");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader title={page.title} intro={about.governance} parent={{ href: "/about", label: tAbout("parent") }} />

      <Section surface="white" aria-labelledby="leaders-senior">
        <Container>
          <Reveal>
            <h2 id="leaders-senior" className="type-h2">
              {t("senior")}
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-14 md:grid-cols-2 md:gap-10">
            {leaders.senior.map((leader, index) => (
              <li key={leader.id}>
                <Reveal delay={index * 0.1} className="grid gap-6">
                  {leader.photo ? (
                    <Photo src={leader.photo} alt={leader.name} sizes="(min-width: 768px) 44vw, 100vw" />
                  ) : (
                    <Placeholder label={tCommon("photoOf", { name: leader.name })} ratio="4/5" />
                  )}
                  <div className="grid gap-3">
                    <h3 className="font-serif text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-tight">{leader.name}</h3>
                    <p className="type-ui">{leader.roles}</p>
                    {leader.bio && <p className="type-body measure text-muted">{leader.bio}</p>}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section spacing="compact" aria-label={`${t("elders")} · ${t("pastorsInTraining")}`}>
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:gap-10">
            {[
              { title: t("elders"), names: leaders.elders },
              { title: t("pastorsInTraining"), names: leaders.pastorsInTraining },
            ].map(({ title, names }, index) => (
              <Reveal key={title} delay={index * 0.1} className="border-t border-rule pt-6">
                <h2 className="type-h3">{title}</h2>
                <ul className="mt-5 grid gap-2 font-serif text-[clamp(1.375rem,1.2rem+0.8vw,1.875rem)] leading-snug">
                  {names.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
