"use client";

import { useEffect, useId, useRef, useState } from "react";
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

/** Past this many pixels the header turns solid; past HIDE_AFTER it hides while scrolling down. */
const SOLID_AFTER = 24;
const HIDE_AFTER = 200;

/**
 * Fixed header. Over a dark hero (overlayHeaderPaths) it starts transparent with cream type, then
 * turns solid cream once the page scrolls. It slides away while reading down and returns on the
 * first scroll up or when keyboard focus enters it.
 */
export function Header() {
  const t = useTranslations("header");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > SOLID_AFTER);
      if (y > HIDE_AFTER && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4 || y <= HIDE_AFTER) setHidden(false);
      lastY.current = y;
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
        data-surface={overlay ? "green" : "cream"}
        onFocusCapture={() => setHidden(false)}
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[translate,background-color,color,border-color] duration-500 ease-out-expo",
          overlay ? "border-b border-transparent bg-transparent" : "border-b border-rule",
          hidden && !menuOpen && "-translate-y-full",
        )}
      >
        <Container className="flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label={t("home")} className="shrink-0">
            <Logo tone={overlay ? "cream" : "green"} width={118} priority />
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
