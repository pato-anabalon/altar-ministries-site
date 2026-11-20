import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/organisms/HomeHero";
import { CommunityBand } from "@/components/organisms/CommunityBand";
import { ExperiencesList } from "@/components/organisms/ExperiencesList";
import { HomeStatement } from "@/components/organisms/HomeStatement";
import { InfoBar } from "@/components/organisms/InfoBar";
import { MessagesSection } from "@/components/organisms/MessagesSection";
import { MinistriesTeaser } from "@/components/organisms/MinistriesTeaser";
import { NewsletterBand } from "@/components/organisms/NewsletterBand";
import { UpcomingEvents } from "@/components/organisms/UpcomingEvents";
import { ValuesBand } from "@/components/organisms/ValuesBand";
import type { Locale } from "@/i18n/routing";
import { getPage } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * Home: hero → when/where → what an Experience is → the Experiences → our DNA → ministries →
 * community → messages → upcoming events → stay in touch. Surfaces alternate to pace the scroll.
 */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const page = getPage("home", locale as Locale);
  const t = await getTranslations("header");
  const tHome = await getTranslations("home");

  return (
    <>
      <HomeHero
        copy={{
          title: page.title,
          intro: page.intro ?? "",
          planVisit: t("planVisit"),
          watchOnline: t("watchOnline"),
          scrollCue: tHome("scrollCue"),
          streamUrl: site.streamUrl,
        }}
      />
      <InfoBar />
      <HomeStatement locale={locale as Locale} />
      <ExperiencesList locale={locale as Locale} />
      <ValuesBand locale={locale as Locale} />
      <MinistriesTeaser locale={locale as Locale} />
      <CommunityBand locale={locale as Locale} />
      <MessagesSection locale={locale as Locale} />
      <UpcomingEvents locale={locale as Locale} />
      <NewsletterBand locale={locale as Locale} />
    </>
  );
}
