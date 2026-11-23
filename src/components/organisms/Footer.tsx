import { getTranslations } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Logo } from "@/components/atoms/Logo";
import { Section } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { isPageLive } from "@/lib/content";
import { connectNav, mainNav, phase2Nav } from "@/lib/nav";
import { site } from "@/lib/site";

/**
 * Footer: where to find us, every page, and the closing ALTAR wordmark set edge to edge.
 * Ends with the Nodo credit ("Built with 💚 by Nodo.co.nz").
 */
export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tHeader = await getTranslations("header");
  const year = new Date().getFullYear();
  // Phase 2 pages once live; Our churches and Supporters are reached from Global.
  const phase2 = phase2Nav.filter((item) => !item.href.startsWith("/global/") && isPageLive(item.key));

  return (
    <Section as="footer" surface="green" spacing="none" className="overflow-hidden pt-20 sm:pt-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-10">
          <div className="grid content-start gap-6">
            <Logo tone="cream" width={140} />
            <p className="type-lead">{t("tagline")}</p>
            <address className="grid gap-1 not-italic type-small text-muted">
              <span className="text-fg">{t("gatherings")}</span>
              <span>{t("sundayTimes")}</span>
              <a href={site.venue.mapsUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
                {site.venue.name}
                <br />
                {site.venue.streetAddress}, {site.venue.suburb}
              </a>
            </address>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="type-small text-muted">
              {t("explore")}
            </h2>
            <ul className="mt-5 grid gap-3 type-ui">
              <li>
                <TextLink href="/visit">{tHeader("planVisit")}</TextLink>
              </li>
              {mainNav
                .filter((item) => item.href !== "/visit")
                .map((item) => (
                  <li key={item.key}>
                    <TextLink href={item.href}>{tNav(item.key)}</TextLink>
                  </li>
                ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-connect">
            <h2 id="footer-connect" className="type-small text-muted">
              {t("connect")}
            </h2>
            <ul className="mt-5 grid gap-3 type-ui">
              <li>
                <TextLink externalHref={site.streamUrl}>{tHeader("watchOnline")}</TextLink>
              </li>
              {[...connectNav, ...phase2].map((item) => (
                <li key={item.key}>
                  <TextLink href={item.href}>{tNav(item.key)}</TextLink>
                </li>
              ))}
              <li>
                <TextLink externalHref={site.instagram}>{t("instagram")}</TextLink>
              </li>
              <li>
                <TextLink externalHref={`mailto:${site.email}`}>{site.email}</TextLink>
              </li>
              {site.phones.map((phone) => (
                <li key={phone.href}>
                  <TextLink externalHref={phone.href}>{phone.label}</TextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>

      {/* Decorative wordmark, low contrast on purpose (WCAG exempts decoration and logotypes). */}
      <p
        aria-hidden
        data-decorative
        // Mon Cheri capitals are a full 1em tall and rise ~0.19em above a 1.0 line box: pad the top,
        // trim the empty descender space below.
        className="mt-12 -mb-[0.16em] pt-[0.2em] text-center font-display text-[25.5vw] leading-none tracking-[-0.01em] text-[color-mix(in_oklab,var(--color-cream)_16%,var(--color-green))] select-none sm:mt-16"
      >
        ALTAR
      </p>

      <Container>
        <div className="flex flex-col gap-3 border-t border-rule py-6 type-small text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {t("rights")}
          </p>
          <p>
            {t("creditBefore")}{" "}
            <span role="img" aria-label={t("heartLabel")}>
              💚
            </span>{" "}
            {t("creditAfter")}{" "}
            <TextLink externalHref={site.credit.href} className="text-fg">
              {site.credit.label}
            </TextLink>
          </p>
        </div>
      </Container>
    </Section>
  );
}
