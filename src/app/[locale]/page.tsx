import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/organisms/HomeHero";
import { InfoBar } from "@/components/organisms/InfoBar";
import type { Locale } from "@/i18n/routing";
import { getPage } from "@/lib/content";
import { site } from "@/lib/site";

/** Home. Milestone 4: hero + info bar; the remaining sections arrive in milestone 4b. */
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
    </>
  );
}
