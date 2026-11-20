import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import type { Locale } from "@/i18n/routing";

/** Milestone 0 placeholder: proves fonts, tokens and i18n end to end. Replaced by the real Home in milestone 4. */
export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations("home");

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-green px-4 text-center text-cream">
      <h1 className="flex flex-col items-center">
        <span className="font-display text-[clamp(4rem,18vw,12rem)] leading-none">ALTAR</span>
        <span className="font-sans text-sm font-normal tracking-[0.5em]">MINISTRIES</span>
      </h1>
      <p className="font-serif text-xl italic sm:text-2xl">{t("tagline")}</p>
      <p className="text-sm text-cream/80">{t("comingSoon")}</p>
    </main>
  );
}
