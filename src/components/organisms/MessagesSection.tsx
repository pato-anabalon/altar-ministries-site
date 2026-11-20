import { getTranslations } from "next-intl/server";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Placeholder } from "@/components/atoms/Placeholder";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import type { Locale } from "@/i18n/routing";
import { getPage } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * Messages on ink: the latest recorded message beside the way to watch online. The video is a
 * placeholder until the client confirms the streaming platform (docs/PENDIENTES.md).
 */
export async function MessagesSection({ locale }: { locale: Locale }) {
  const page = getPage("home", locale);
  const t = await getTranslations("home");
  const tHeader = await getTranslations("header");

  return (
    <Section surface="ink" aria-labelledby="messages-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <Reveal className="lg:col-span-4">
            <h2 id="messages-title" className="type-h2">
              {t("messagesTitle")}
            </h2>
            <p className="mt-4 type-lead text-muted">{page.messages}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button externalHref={site.streamUrl} arrow>
                {tHeader("watchOnline")}
              </Button>
              <Button href="/resources" variant="secondary">
                {t("messagesAll")}
              </Button>
            </div>
          </Reveal>
          <Reveal variant="photo" className="lg:col-span-7 lg:col-start-6">
            <Placeholder label={t("messagesVideo")} ratio="16/9" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
