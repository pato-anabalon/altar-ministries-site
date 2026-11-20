import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Logo, type LogoTone } from "@/components/atoms/Logo";
import { Placeholder } from "@/components/atoms/Placeholder";
import { Section, type SurfaceName } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { Wordmark } from "@/components/atoms/Wordmark";
import type { Locale } from "@/i18n/routing";
import { site } from "@/lib/site";
import { ModalDemo } from "./ModalDemo";

export const metadata: Metadata = { title: "Styleguide", robots: { index: false, follow: false } };

/** Internal design-system reference (milestone 1). Development only. */
export default function StyleguidePage({ params }: PageProps<"/[locale]/dev/styleguide">) {
  if (process.env.NODE_ENV === "production") notFound();
  const { locale } = use(params);
  setRequestLocale(locale as Locale);

  return (
    <main>
      <Section surface="green" className="text-center">
        <Container>
          <Wordmark className="text-[clamp(5rem,18vw,13rem)]" />
          <p className="mx-auto mt-10 type-lead text-muted">Design system · internal reference</p>
        </Container>
      </Section>

      <Palette />
      <Typography />
      <Surfaces />
      <Logos />
      <Placeholders />
    </main>
  );
}

const palette: Array<{ token: string; hex: string; role: string; swatch: string; text: string }> = [
  { token: "green", hex: "#1B3D2D", role: "Brand: hero, featured bands, primary actions, logo", swatch: "bg-green", text: "text-cream" },
  { token: "cream", hex: "#EFEBD2", role: "Page background", swatch: "bg-cream", text: "text-ink" },
  { token: "white", hex: "#FFFFFF", role: "Raised surfaces: cards, modals", swatch: "bg-white", text: "text-ink" },
  { token: "ink", hex: "#000000", role: "Headings and text; dark bands", swatch: "bg-ink", text: "text-cream" },
  { token: "stone", hex: "#4B4943", role: "Secondary text, metadata, rules", swatch: "bg-stone", text: "text-cream" },
];

function Palette() {
  return (
    <Section aria-labelledby="sg-palette">
      <Container>
        <h2 id="sg-palette" className="type-h2">
          Balance of white, black and green
        </h2>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {palette.map((color) => (
            <li key={color.token} className="overflow-hidden rounded-[2px] border border-rule">
              <div className={`${color.swatch} ${color.text} flex aspect-[4/3] items-end p-4`}>
                <span className="type-h3">{color.token}</span>
              </div>
              <div className="grid gap-1 p-4">
                <span className="type-ui tabular-nums">{color.hex}</span>
                <span className="type-small text-muted">{color.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function Typography() {
  const rows: Array<{ name: string; spec: string; node: React.ReactNode }> = [
    { name: "type-display", spec: "TAN Mon Cheri, capitals · 36–96px", node: <p className="type-display">Experience Christ</p> },
    { name: "type-h1", spec: "TAN Mon Cheri, capitals · 36–68px", node: <p className="type-h1">A church in Ponsonby, Auckland</p> },
    { name: "type-h2", spec: "Playfair Display · 30–48px", node: <p className="type-h2">We don&apos;t talk about Sunday services. We talk about Experiences.</p> },
    { name: "type-h3", spec: "TAN Tangkiwood · 20–24px", node: <p className="type-h3">Friday Home Experience</p> },
    {
      name: "type-lead",
      spec: "Playfair Display · 19–23px",
      node: (
        <p className="type-lead measure">
          The integral transformation of lives and communities through the strategic extension of God&apos;s Kingdom.
        </p>
      ),
    },
    {
      name: "type-body",
      spec: "Inter Light 300 · 17px / 1.7 · 68ch",
      node: (
        <p className="type-body measure">
          Altar Ministries is a church that began on 1 April 2023 with weekly gatherings at Juan Pablo and Natalie&apos;s
          home, and was later formalised as the first initiative of the Nexus Initiative Trust. We are a home for migrants,
          local families and new generations, with a strong devotion to Aotearoa New Zealand, the place we now call home.
        </p>
      ),
    },
    { name: "type-small", spec: "Inter 400 · 14px", node: <p className="type-small text-muted">Sunday · St Stephen&apos;s, Ponsonby · English and Spanish</p> },
    { name: "type-ui", spec: "Inter 500 · 15px", node: <p className="type-ui">Plan your visit</p> },
  ];

  return (
    <Section surface="white" aria-labelledby="sg-type">
      <Container>
        <h2 id="sg-type" className="type-h2">
          Type scale
        </h2>
        <dl className="mt-12 grid">
          {rows.map((row) => (
            <div key={row.name} className="grid gap-4 border-t border-rule py-8 lg:grid-cols-[14rem_1fr] lg:gap-12">
              <dt className="grid content-start gap-1">
                <code className="type-ui">{row.name}</code>
                <span className="type-small text-muted">{row.spec}</span>
              </dt>
              <dd className="min-w-0">{row.node}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}

function Surfaces() {
  const surfaces: SurfaceName[] = ["cream", "white", "green", "ink"];
  return (
    <>
      {surfaces.map((surface) => (
        <Section key={surface} surface={surface} spacing="compact" aria-labelledby={`sg-surface-${surface}`}>
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="type-small text-muted">surface=&quot;{surface}&quot;</p>
                <h2 id={`sg-surface-${surface}`} className="mt-3 type-h2">
                  Everyone is welcome
                </h2>
                <p className="mt-4 type-body measure text-muted">
                  We create safe spaces for migrants, new families, children and people who are hurting or vulnerable.{" "}
                  <TextLink href="/visit">Plan your visit</TextLink> or <TextLink externalHref={site.instagram}>follow us on Instagram</TextLink>.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/visit" arrow>
                  Plan your visit
                </Button>
                <Button variant="secondary" externalHref="https://www.instagram.com/altar.ministries/" arrow>
                  Watch online
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      ))}
      <Section spacing="compact" aria-labelledby="sg-modal">
        <Container>
          <h2 id="sg-modal" className="type-h2">
            Modal
          </h2>
          <p className="mt-4 mb-8 type-body measure text-muted">Native dialog: Escape, backdrop click and the close button all close it; focus stays inside.</p>
          <ModalDemo />
        </Container>
      </Section>
    </>
  );
}

function Logos() {
  const tones: Array<{ tone: LogoTone; surface: SurfaceName }> = [
    { tone: "green", surface: "cream" },
    { tone: "ink", surface: "white" },
    { tone: "cream", surface: "green" },
    { tone: "white", surface: "ink" },
  ];
  return (
    <Section surface="white" aria-labelledby="sg-logo">
      <Container>
        <h2 id="sg-logo" className="type-h2">
          Logo and wordmark
        </h2>
        <p className="mt-4 type-body measure text-muted">
          The PNG logo (with the waved A) in header and footer; large ALTAR as live text in TAN Mon Cheri.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {tones.map(({ tone, surface }) => (
            <div key={tone} data-surface={surface} className="grid aspect-[3/2] place-items-center rounded-[2px] border border-rule">
              <Logo tone={tone} />
            </div>
          ))}
        </div>
        <div data-surface="cream" className="mt-3 grid place-items-center rounded-[2px] border border-rule px-4 py-16 text-green">
          <Wordmark className="text-[clamp(4rem,12vw,9rem)]" />
        </div>
      </Container>
    </Section>
  );
}

function Placeholders() {
  return (
    <Section aria-labelledby="sg-placeholder">
      <Container>
        <h2 id="sg-placeholder" className="type-h2">
          Placeholders
        </h2>
        <p className="mt-4 type-body measure text-muted">Missing client material keeps its final ratio and says what goes there.</p>
        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          <Placeholder label="Photo: Juan Pablo Dadah" ratio="4/5" />
          <Placeholder label="Photo: Natalie Molina" ratio="4/5" />
          <Placeholder label="Video: latest message" ratio="4/5" />
        </div>
      </Container>
    </Section>
  );
}
