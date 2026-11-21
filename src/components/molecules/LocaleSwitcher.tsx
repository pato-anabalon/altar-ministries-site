"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { translateSlug } from "@/lib/content/slugs";

/** EN · ES. Keeps the visitor on the same page in the other language, translated slug included. */
export function LocaleSwitcher({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const t = useTranslations("header");
  const current = useLocale();
  const pathname = usePathname();
  const params = useParams();
  // A route whose dynamic segments are not all known (e.g. the 404 for an unknown slug) can't be
  // translated: send the visitor to the other language's home instead of failing to render.
  const complete = (pathname.match(/\[(\w+)\]/g) ?? []).every((segment) => typeof params[segment.slice(1, -1)] === "string");
  const hrefFor = (locale: Locale) => {
    if (!complete) return "/" as ComponentProps<typeof Link>["href"];
    const slug = typeof params.slug === "string" ? translateSlug(pathname, params.slug, locale) : undefined;
    return { pathname, params: slug ? { ...params, slug } : params } as ComponentProps<typeof Link>["href"];
  };

  return (
    <nav aria-label={t("language")} className={cn("flex items-center gap-1 type-ui", className)}>
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 && (
            <span aria-hidden className="text-muted">
              ·
            </span>
          )}
          <Link
            href={hrefFor(locale)}
            locale={locale}
            hrefLang={locale}
            lang={locale}
            aria-current={locale === current ? "true" : undefined}
            onClick={onNavigate}
            className={cn(
              "grid min-h-11 min-w-9 place-items-center uppercase transition-colors duration-300",
              locale === current ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            {locale}
          </Link>
        </span>
      ))}
    </nav>
  );
}
