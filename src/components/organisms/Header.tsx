"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Logo } from "@/components/atoms/Logo";
import { LocaleSwitcher } from "@/components/molecules/LocaleSwitcher";
import { MobileMenu } from "@/components/organisms/MobileMenu";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { isActive, mainNav, overlayHeaderPaths } from "@/lib/nav";
import { site } from "@/lib/site";

/** Past this many pixels the header turns solid (pages without an overlay hero). */
const SOLID_AFTER = 24;

/**
 * Fixed header. Over a dark hero (overlayHeaderPaths) it stays transparent with cream type for as
 * long as the hero (marked `data-header-overlay`, pinned or not) is behind it, then turns solid
 * cream. Elsewhere it turns solid once the page scrolls. It always stays in view.
 */
export function Header() {
  const t = useTranslations("header");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);

  // Layout effect: on a route change the new state (transparent over the Home hero) is set before
  // the first paint, instead of showing the previous page's solid header for a frame.
  useLayoutEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.querySelector("[data-header-overlay]");
      setScrolled(hero ? hero.getBoundingClientRect().bottom <= (header.current?.offsetHeight ?? 0) : window.scrollY > SOLID_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const overlay = overlayHeaderPaths.includes(pathname as (typeof overlayHeaderPaths)[number]) && !scrolled;

  return (
    <>
      <header
        ref={header}
        data-surface={overlay ? "green" : "cream"}
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,color,border-color,backdrop-filter] duration-500 ease-out-expo",
          // Over the hero a light blur and tint keep the links legible when hero type passes beneath.
          overlay ? "border-b border-transparent bg-ink/15 backdrop-blur-md" : "border-b border-rule",
        )}
      >
        <Container className="flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label={t("home")} className="shrink-0">
            <Logo tone={overlay ? "cream" : "green"} width={118} eager />
          </Link>

          <nav aria-label={t("mainNav")} className="hidden xl:block">
            <ul className="flex items-center gap-8">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex min-h-11 items-center type-ui",
                        "after:absolute after:inset-x-0 after:bottom-2.5 after:h-px after:bg-current after:transition-transform after:duration-500 after:ease-out-expo",
                        active
                          ? "after:scale-x-100"
                          : "after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100",
                      )}
                    >
                      {tNav(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href={site.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden min-h-11 items-center gap-1.5 type-ui xl:inline-flex"
            >
              {t("watchOnline")}
              <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            {/* Visibility lives on wrappers: a display utility on the component would fight its own flex class. */}
            <div className="hidden xl:block">
              <LocaleSwitcher />
            </div>
            <div className="hidden sm:block">
              <Button href="/visit">{t("planVisit")}</Button>
            </div>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen(true)}
              className="-mr-2 inline-flex min-h-11 items-center gap-3 px-2 type-ui xl:hidden"
            >
              {t("openMenu")}
              <span aria-hidden className="grid w-6 gap-1.5">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-2/3 justify-self-end bg-current" />
              </span>
            </button>
          </div>
        </Container>
      </header>

      {/* Pages without a dark hero start below the fixed header. */}
      {!overlayHeaderPaths.includes(pathname as (typeof overlayHeaderPaths)[number]) && <div aria-hidden className="h-20" />}

      <MobileMenu id={menuId} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
