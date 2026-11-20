# AGENTS.md

Website for Altar Ministries, a bilingual (EN/ES) church in Ponsonby, Auckland. Built by Nodo.
Read `docs/PLAN-IMPLEMENTACION.md` (plan, design direction, site map) and `docs/PENDIENTES.md` (open items, placeholders) first.

## Architecture
Next.js 16 App Router, TS strict, Tailwind 4, next-intl. Atomic Design in `src/components/{atoms,molecules,organisms,templates}`, aliases `@/…`.
Routes live under `src/app/[locale]/`; the site map with translated slugs is `src/i18n/routing.ts`. Always link with `@/i18n/navigation`, never `next/link`.
UI strings in `src/messages/{en,es}.json` (same keys in both, enforced by tests). Site facts in `src/lib/site.ts`. Tokens in `src/app/globals.css`, fonts in `src/app/fonts.ts`.
Content is code: pages read content only through `src/lib/content` (zod-validated MDX/TS), never files directly. No CMS, no database in phase 1.
Server Components by default; Client Components only for small interactive islands.

## Brand
Palette tokens: `green` #1B3D2D, `cream` #EFEBD2 (page background), `white`, `ink` #000, `stone` #4B4943. No accent colour.
Fonts: `font-display` TAN Mon Cheri (wordmark, H1), `font-accent` TAN Tangkiwood (short accents only), `font-serif` Playfair Display (H2, quotes), `font-sans` Inter (body at weight 300, UI).
Logo: PNG `public/images/logo/6–9-logo.png` (black, white, cream, green; transparent) in header/footer; large "ALTAR" is live text in `font-display`.
Tone: majestic, intimate, peaceful, minimalist. Not a megachurch look.

## Nodo signature
Every Nodo site has a preloader, a striking preloader → hero transition, a high-impact hero, and the footer credit "Built with 💚 by Nodo.co.nz". Here: arch-reveal preloader into a pinned hero where the arch grows to full screen (plan §1).

## Content rules
Never invent testimonials, people, dates, bios, numbers or quotes. Missing material → `<Placeholder>` with the final aspect ratio and a label. Spanish source texts are translated to English (en-NZ) pending client review.
`public/` is served: private client documents and heavy originals go in `design-source/` (gitignored).

## Animation
GSAP + `@gsap/react` (`useGSAP` with cleanup, scoped per section), Lenis for smooth scroll. Transform/opacity only. Honour `prefers-reduced-motion` with a static fallback. Preloader once per session, with a hard deadline.

## Git & deploy
The owner commits and pushes; never commit or push. Review happens locally only (`npm run dev`); the project is connected to Vercel by the owner at launch, never deploy or link it.

## Verify
`npm run verify` (lint, typecheck, test, build). Also check 375/768/1024/1440 px, keyboard, reduced motion, no horizontal overflow, both locales.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
