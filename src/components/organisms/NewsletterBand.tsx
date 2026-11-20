import { getTranslations } from "next-intl/server";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import type { Locale } from "@/i18n/routing";
import { getPage } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * Closing invitation to stay in touch. The sign-up form itself arrives with the Resend wiring
 * (milestone 8); until then this points to the newsletter page and Instagram.
 */
export async function NewsletterBand({ locale }: { locale: Locale }) {
  const page = getPage("newsletters", locale);
  const t = await getTranslations("home");

  return (
    <Section surface="green" spacing="compact" aria-labelledby="newsletter-title" className="border-b border-rule">
      <Container>
        <Reveal className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-16">
          <div>
            <h2 id="newsletter-title" className="type-h2">
              {page.title}
            </h2>
            {page.intro && <p className="mt-4 type-lead measure text-muted">{page.intro}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/resources/newsletters" arrow>
              {t("newsletterCta")}
            </Button>
            <Button externalHref={site.instagram} variant="secondary" arrow>
              Instagram
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
