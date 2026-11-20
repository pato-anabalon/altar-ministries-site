"use client";

import type { ComponentProps } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * EN · ES. Keeps the visitor on the same page in the other language (translated slug included).
 * Dynamic routes reuse the current params; content-specific slugs are mapped in their own milestone.
 */
export function LocaleSwitcher({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const t = useTranslations("header");
  const current = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const href = { pathname, params } as ComponentProps<typeof Link>["href"];

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
            href={href}
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
