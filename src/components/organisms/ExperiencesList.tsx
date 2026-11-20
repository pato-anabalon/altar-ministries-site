import { getTranslations } from "next-intl/server";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import type { Locale } from "@/i18n/routing";
import { getExperiences } from "@/lib/content";

/**
 * The five Experiences as an editorial list (not a card grid): name on the left; when, where and
 * what on the right. Reused on Visit us with `showCta={false}`.
 */
export async function ExperiencesList({ locale, showCta = true }: { locale: Locale; showCta?: boolean }) {
  const experiences = getExperiences(locale);
  const t = await getTranslations("home");

  return (
    <Section surface="white" aria-labelledby="experiences-title">
      <Container>
        <Reveal>
          <h2 id="experiences-title" className="type-h2">
            {t("experiencesTitle")}
          </h2>
        </Reveal>
        <ul className="mt-12 border-b border-rule sm:mt-16">
          {experiences.map((experience) => (
            <li key={experience.id} className="border-t border-rule">
              <Reveal className="grid gap-4 py-8 sm:py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
                <h3 className="font-serif text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-tight">{experience.name}</h3>
                <div className="grid gap-3">
                  {(experience.schedule || experience.location) && (
                    <p className="grid gap-1">
                      {experience.schedule && <span className="type-ui">{experience.schedule}</span>}
                      {experience.location && <span className="type-small text-muted">{experience.location}</span>}
                    </p>
                  )}
                  <p className="type-body measure text-muted">{experience.summary}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        {showCta && (
          <Reveal className="mt-12">
            <Button href="/visit" variant="secondary" arrow>
              {t("experiencesCta")}
            </Button>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
