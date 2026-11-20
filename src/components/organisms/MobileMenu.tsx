"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Logo } from "@/components/atoms/Logo";
import { TextLink } from "@/components/atoms/TextLink";
import { LocaleSwitcher } from "@/components/molecules/LocaleSwitcher";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { lockScroll } from "@/lib/motion/lenis";
import { connectNav, isActive, mainNav } from "@/lib/nav";
import { site } from "@/lib/site";

/**
 * Full-screen menu below xl. A native modal <dialog>: focus trap, Escape and inert page for free.
 * Items rise in a short stagger (.altar-menu in globals.css); closes on navigation.
 */
export function MobileMenu({ id, open, onClose }: { id: string; open: boolean; onClose: () => void }) {
  const t = useTranslations("header");
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const pathname = usePathname();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (open) return lockScroll();
  }, [open]);

  return (
    <dialog
      ref={ref}
      id={id}
      aria-label={t("mainNav")}
      data-surface="green"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      className="altar-menu m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain p-0"
    >
      <Container className="flex min-h-full flex-col">
        <div className="flex h-20 shrink-0 items-center justify-between">
          <Link href="/" aria-label={t("home")} onClick={onClose}>
            <Logo tone="cream" width={118} />
          </Link>
          {/* Initial focus inside the modal dialog belongs on its close control. */}
          <button type="button" autoFocus onClick={onClose} className="-mr-2 inline-flex min-h-11 items-center gap-3 px-2 type-ui">
            {t("closeMenu")}
            <X aria-hidden strokeWidth={1.5} className="size-5" />
          </button>
        </div>

        <nav aria-label={t("mainNav")} className="flex-1 py-8 sm:py-12">
          <ul className="grid gap-1">
            {mainNav.map((item, index) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.key} className="altar-menu-item" style={{ "--i": index } as CSSProperties}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-12 items-center font-display text-[clamp(2.25rem,9vw,4rem)] leading-none uppercase transition-colors duration-300",
                      active ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="altar-menu-item grid gap-8 border-t border-rule py-8" style={{ "--i": mainNav.length } as CSSProperties}>
          <div className="flex flex-wrap gap-3">
            <Button href="/visit" onClick={onClose} arrow>
              {t("planVisit")}
            </Button>
            <Button variant="secondary" externalHref={site.streamUrl} arrow>
              {t("watchOnline")}
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 type-ui">
              {connectNav.map((item) => (
                <li key={item.key}>
                  <TextLink href={item.href} onClick={onClose}>
                    {tNav(item.key)}
                  </TextLink>
                </li>
              ))}
              <li>
                <TextLink externalHref={site.instagram}>{tFooter("instagram")}</TextLink>
              </li>
            </ul>
            <LocaleSwitcher onNavigate={onClose} />
          </div>
        </div>
      </Container>
    </dialog>
  );
}
