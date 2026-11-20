import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-display text-8xl text-green">404</p>
      <h1 className="font-serif text-3xl">{t("title")}</h1>
      <Link href="/" className="underline underline-offset-4 hover:text-green">
        {t("back")}
      </Link>
    </main>
  );
}
