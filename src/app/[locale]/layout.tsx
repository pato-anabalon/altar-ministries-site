import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header";
import { SmoothScroll } from "@/components/organisms/SmoothScroll";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";
import { fontVariables } from "../fonts";
import "../globals.css";

export const viewport: Viewport = {
  themeColor: "#1b3d2d",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: `%s | ${site.name}` },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "header" });

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <NextIntlClientProvider>
          <a
            href="#main"
            className="fixed top-3 left-3 z-50 -translate-y-24 rounded-[2px] bg-green px-4 py-3 type-ui text-cream transition-transform focus:translate-y-0"
          >
            {t("skipToContent")}
          </a>
          <SmoothScroll />
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
