import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Wordmark } from "@/components/atoms/Wordmark";
import type { Locale } from "@/i18n/routing";

/** Placeholder until the real Home (milestone 4): dark band so the overlay header can be reviewed. */
export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations("home");

  return (
    <div data-surface="green" className="flex min-h-svh flex-col items-center justify-center gap-8 px-4 text-center">
      <h1>
        <Wordmark className="text-[clamp(5rem,20vw,13rem)]" />
      </h1>
      <p className="type-lead">{t("tagline")}</p>
      <p className="type-small text-muted">{t("comingSoon")}</p>
    </div>
  );
}
