# Altar Ministries — Plan de implementación

Versión 1 · 2026-11-20 · Ver también [PENDIENTES.md](./PENDIENTES.md)

- **Dominio:** https://altar.org.nz
- **Repo:** https://github.com/pato-anabalon/altar-ministries-site
- **Instagram:** https://www.instagram.com/altar.ministries/
- **Correo (temporal):** contact@altar.org.nz

---

## 1. Dirección de diseño

### Conceptos de marca (concept board)
Majestic · Intimate · Peaceful · Minimalist · Dynamic & Alive · **Contracultura** ("lo opuesto a una mega church: familiar, íntimo pero majestuoso").
Motivo visual: el edificio de St Stephen's (arcos ojivales, rosetón, vitrales, madera). El arco ya vive en la "A" del logo.

### Qué tomamos de cada referencia
| Referencia | Tomamos | Evitamos |
|---|---|---|
| **Bridgetown** (principal) | Tipografía enorme, hero con foto de vitrales a sangre, bloques editoriales foto-grilla + texto con horarios/ubicación, frase-manifiesto sobre foto full-bleed, mucho aire | — |
| **New Life Oxnard** | Barra de info bajo el hero (horario · dirección · cómo llegar), horarios gigantes tipográficos sobre fondo oscuro, lista de valores como tipografía, tira de fotos, cards de "lo último" | Exceso de elementos flotantes |
| **Gas Street** | Fondo off-white cálido + casi-negro, frase de creencia + 2 fotos, trío "Connect" (Soy nuevo / Planifica tu visita / Próximos eventos), sección oscura de mensajes con video, CTA dual (Plan a visit / Join online) | Botón flotante permanente |
| **Elevation** | "Find the right experience for you" → patrón para nuestras *Experiences* | Estética dark/carruseles de campaña, tono megaiglesia |
| **Hillsong** | Idea de mapa para la red Global (fase 2) | Look genérico |

**Resumen:** editorial, sobrio y fotográfico. La majestad viene de la escala tipográfica y del espacio, no de efectos.

### Paleta (tokens)
| Token | Hex | Uso |
|---|---|---|
| `green` | #1B3D2D | Marca: hero, secciones destacadas, CTA primario, logo |
| `cream` | #EFEBD2 | Fondo principal |
| `white` | #FFFFFF | Cards, modales, texto sobre verde/foto |
| `ink` | #000000 | Títulos y texto; secciones oscuras (Resources, horarios) |
| `stone` | #4B4943 | Texto secundario, metadatos, bordes |

- Contrastes verificados (AA): ink/cream 17.5 · stone/cream 7.5 · cream/green 10 · white/green 12.
- cream vs white = 1.2 → las cards blancas sobre crema llevan borde `stone/15` o sombra suave.
- Sin color de acento: CTAs en verde/crema. Derivar tintes de `green` (hover, bordes) con `color-mix`.

### Tipografía
| Rol | Fuente | Uso |
|---|---|---|
| Display | **TAN Mon Cheri** (`src/app/fonts/tan-mon-cheri-regular.woff2`) | Wordmark "ALTAR" en grande, H1, horarios gigantes. **Siempre en mayúsculas**: su "t" minúscula es una "i" con destello y sin travesaño ("Christ" se lee "Chrisi"); no hay glifo alternativo |
| Secundaria | **TAN Tangkiwood** (`src/app/fonts/tan-tangkiwood-regular.woff2`) | Acentos cortos: H3, números. Es muy gruesa: usar con moderación. Sin eyebrows (etiquetas sobre títulos) |
| Terciaria | **Playfair Display** (Google Fonts) | H2, citas, entradillas |
| Cuerpo/UI | **Inter** (Google Fonts, variable; usar peso 300 light para párrafos) | Párrafos, navegación, formularios |

Todas cargadas con `next/font/local` / `next/font/google` (self-hosted, `display: swap`, preload solo de la display). Ambas fuentes TAN cubren tildes, ñ y ¿¡.

### Logo
- **Header y footer:** imagen PNG con transparencia (`public/images/logo/6-9-logo.png`; la variante cambia solo de color).
  - 6 = negro · 7 = blanco · 8 = crema · 9 = verde. Elegir según fondo.
- **Logo en grande** (hero, cierres, piezas especiales): texto "ALTAR" en vivo con TAN Mon Cheri (sin la onda de la A por ahora).
- Pendiente fase 2: vectorizar a SVG.

### Firma Nodo: Preloader → Hero

Secuencia continua (sello de los sitios Nodo: preloader + transición + hero de impacto). Referencia de mecánica: https://image-showcase-pro-by-os.framer.website/

1. **Preloader** (pantalla `green`): "ALTAR" en TAN Mon Cheri aparece letra a letra; "MINISTRIES" debajo con los puntos-destello de la "i" titilando.
2. **Transición:** se abre un **arco ojival** al centro (clip-path) que revela la imagen del hero; el preloader se desvanece y ese arco queda como la imagen central.
3. **Hero (pinned, ~150–200vh, scrub):**
   - Fondo: Auckland al atardecer (skyline con Sky Tower) o St Stephen's.
   - Centro: arco ojival con la cruz y el haz de luz.
   - Al scrollear: "ALTAR" se divide a izquierda y derecha, el arco crece hasta pantalla completa (el arco se transforma en rectángulo), el fondo se desvanece/desenfoca.
   - Al final: "A church in Ponsonby, Auckland" + CTAs *Plan your visit* / *Watch online*.
4. Justo después: InfoBar (horario · dirección · cómo llegar).

**Reglas** (mismo patrón que life-painting `LifePaintingPreloader`):
- Una vez por sesión (`data-*` en `<html>` + sessionStorage), watchdog de arranque y deadline duro.
- `prefers-reduced-motion`: sin preloader, hero estático a pantalla completa.
- LCP: imagen de fondo con `priority`, AVIF comprimido; el preloader no bloquea la carga.
- Mobile: misma secuencia con arco vertical; pin más corto.

**Imágenes del hero (a generar/conseguir)**
- Cruz con haz de luz: **luz cálida/blanca, sin neón rosa** (fuera de paleta y del tono "contracultura"). Generada con IA está bien (es simbólica). Entregar **16:9 y 9:16** o composición centrada con aire lateral.
- Fondo Auckland: preferir foto real con licencia (Unsplash) sobre IA.
- No usar IA para el edificio ni la congregación (autenticidad).

### Footer: crédito Nodo
"Built with 💚 by Nodo.co.nz" (ES: "Hecho con 💚 por Nodo.co.nz"), link a https://nodo.co.nz en pestaña nueva, `aria-label` descriptivo y el emoji con label accesible. Mismo formato de datos que life-painting (`credit: { before, heart, heartLabel, after, label, href }`).

### Imágenes
- Usar las 13 fotos actuales (`public/images/church`, 1080×1350 con marca de agua) como provisionales.
- Donde no haya foto: componente `<Placeholder>` con el aspect ratio final y una etiqueta ("Foto: Senior Leaders"), para reemplazar 1 a 1.
- Todas por `next/image` con `sizes` correctos; formatos AVIF/WebP automáticos.

---

## 2. Stack y librerías

Mismo stack que life-painting-site / nodo-site / liberty-security.

| Área | Librería |
|---|---|
| Framework | Next.js 16 (App Router, RSC, TypeScript estricto) |
| Estilos | Tailwind CSS v4 (tokens en `@theme`) + `clsx` |
| i18n | `next-intl` con `pathnames` traducidos, `en` por defecto |
| Animación | `gsap` + `@gsap/react` (ScrollTrigger, SplitText) |
| Scroll suave | `lenis` (sincronizado con ScrollTrigger) |
| Contenido | MDX (`@next/mdx`) + metadata validada con `zod` |
| Formularios | Server Actions + `zod` + `resend` |
| Archivos pesados | `@vercel/blob` (audio, PDFs) — cuando haya material |
| Iconos | `lucide-react` |
| Analítica | `@vercel/analytics`, `@vercel/speed-insights` |
| Tests | `vitest`; `@playwright/test` + `@axe-core/playwright` en el hito de pulido |
| Calidad | ESLint + `npm run verify` (lint, typecheck, test, build), como life-painting |

Sin CMS, sin base de datos en fase 1.

---

## 3. Mapa de rutas (bilingüe)

`/en/...` y `/es/...`, slugs traducidos vía `next-intl` `pathnames`. `/` redirige según `Accept-Language` (por defecto `en`).

| Página | EN | ES | Fase |
|---|---|---|---|
| Home | `/en` | `/es` | 1 |
| Visit Us | `/en/visit` | `/es/visitanos` | 1 |
| About | `/en/about` | `/es/nosotros` | 1 |
| ↳ Our History | `/en/about/history` | `/es/nosotros/historia` | 1 |
| ↳ Our DNA | `/en/about/dna` | `/es/nosotros/adn` | 1 |
| ↳ Leadership | `/en/about/leadership` | `/es/nosotros/liderazgo` | 1 |
| Ministries | `/en/ministries` | `/es/ministerios` | 1 |
| ↳ Ministerio (modal) | `/en/ministries/[slug]` | `/es/ministerios/[slug]` | 1 |
| Community | `/en/community` | `/es/comunidad` | 1 |
| Global | `/en/global` | `/es/global` | 1 |
| ↳ Missions & Church Planting | `/en/global/missions` | `/es/global/misiones` | 1 |
| ↳ Global Community | `/en/global/community` | `/es/global/comunidad` | 1 |
| ↳ Partners in Faith | `/en/global/partners` | `/es/global/aliados` | 1 |
| ↳ Our Churches | `/en/global/churches` | `/es/global/iglesias` | 2 |
| ↳ Supporters | `/en/global/supporters` | `/es/global/patrocinadores` | 2 |
| Events | `/en/events` | `/es/eventos` | 1 |
| ↳ Evento | `/en/events/[slug]` | `/es/eventos/[slug]` | 1 |
| Resources | `/en/resources` | `/es/recursos` | 1 |
| ↳ Newsletters | `/en/resources/newsletters` | `/es/recursos/boletines` | 1 |
| ↳ Policies | `/en/resources/policies` | `/es/recursos/politicas` | 1 |
| Contact | `/en/contact` | `/es/contacto` | 1 |
| Give | `/en/give` | `/es/donar` | 2 |
| Opportunities | `/en/opportunities` | `/es/oportunidades` | 2 |
| Bookshop | `/en/bookshop` | `/es/libreria` | 2 |

**Ministerios** (10, grilla + modal): kids, youth, women, men, worship, prophetic, media, hospitality, maintenance, special-events.
Modal con URL propia → *intercepting + parallel routes* (`@modal/(.)ministries/[slug]`): desde la grilla abre modal y "atrás" lo cierra; acceso directo renderiza la página completa.

**Navegación**
- Header: Visit Us · About · Ministries · Community · Global · Events · Resources · [Contact] · EN/ES. CTA "Plan your visit".
- Footer: logo, dirección y horarios, Contact, Newsletter (signup), Policies, Instagram, copyright.
- Las páginas de fase 2 no se enlazan hasta activarse (rutas sin generar, no 404 enlazados).

---

## 4. Arquitectura del proyecto

```
src/
  app/
    [locale]/
      layout.tsx              # fuentes, header, footer, Lenis provider
      page.tsx                # Home
      visit/ about/ ministries/ community/ global/ events/ resources/ contact/
      ministries/@modal/(.)[slug]/page.tsx
    api/revalidate/route.ts   # cron diario (Events)
    sitemap.ts  robots.ts
  components/            # Atomic Design, igual que los otros proyectos Nodo
    atoms/       # Button, TextLink, Container, Placeholder, Logo, Wordmark
    molecules/   # EventCard, LeaderCard, MinistryCard, LocaleSwitcher, NewsletterForm
    organisms/   # Header, MobileMenu, Footer, AltarPreloader, Hero, InfoBar, ExperiencesGrid,
                 # Statement, ValuesList, MinistryGrid, MinistryModal, Timeline, ContactForm
    templates/   # Composición por página
  lib/motion/            # register, once, preloader, helpers de scroll
  content/
    events/            todo-por-amor.en.mdx / .es.mdx
    pages/             about.en.mdx / about.es.mdx ...
    data/              ministries.ts, leaders.ts, experiences.ts, beliefs.ts, values.ts, site.ts
  lib/
    content/           # ÚNICA capa de lectura: getEvents(), getMinistry()... + schemas zod
    email/             # Resend
  i18n/
    routing.ts  navigation.ts  request.ts
  messages/  en.json  es.json   # textos de UI (botones, labels, nav)
  proxy.ts                      # next-intl (Next 16: proxy reemplaza a middleware)
```

**Reglas**
- Las páginas nunca leen archivos directamente; siempre vía `lib/content` (permite migrar a DB/admin propio sin tocar páginas).
- Textos de UI en `messages/*.json`; contenido largo en MDX/data por locale.
- Build falla si una entrada no tiene su par EN/ES o no valida su schema.
- Todo estático (SSG). Events con revalidación diaria vía Vercel Cron.

---

## 5. Inventario de secciones por página

**Home**
1. Hero pinned con arco que se expande (ver "Firma Nodo: Preloader → Hero") + "A church in Ponsonby, Auckland" + CTAs *Plan your visit* / *Watch online*
2. InfoBar: Sunday Experience (horario) · St Stephen's Presbyterian Church, Ponsonby (dirección exacta a verificar con el prototipo) · Cómo llegar
3. Statement: frase de creencia + 2 fotos (estilo Gas Street)
4. Experiences: grilla de las 5 Experiences
5. Valores (DNA) como lista tipográfica
6. Trío Connect: Soy nuevo · Ministerios · Próximos eventos
7. Comunidad (Pantry / Christmas Dinner) — banda verde
8. Messages: sección oscura con el último mensaje en video + "Watch online" / "View all" (estilo Gas Street)
9. Próximos eventos (2–3 cards)
10. Newsletter signup

**Visit Us**: Experiences (cuándo/dónde, idioma) · cómo unirse online (link a la transmisión) · qué esperar · mapa · horarios gigantes (estilo New Life) · FAQ · CTA contacto.
**About**: quiénes somos · misión/visión · lo que creemos (8 fundamentos, acordeón) · gobierno espiritual · aspiración · links a History / DNA / Leadership · descarga PDF perfil institucional.
**History**: timeline (desde 1-abr-2023, Nexus Initiative Trust).
**DNA**: 6 valores con desarrollo.
**Leadership**: Senior Leaders, Elders, Pastors in training (placeholders de foto/bio).
**Ministries**: intro + grilla de 10 → modal.
**Community**: Pantry · Christmas Dinner · Kids Presents · Migrant support · otras organizaciones.
**Global**: intro + Missions · Global Community · Partners (+ fase 2).
**Events**: próximos · calendario anual · pasados. Detalle por evento.
**Resources**: Sermons (videos de transmisiones; embed liviano tipo facade: miniatura + carga del player al hacer clic) · Audio · Audiobooks · PDFs (placeholders hasta tener material) · Newsletters · Policies.
**Contact**: formulario (Resend → contact@altar.org.nz) · dirección · Instagram.

---

## 6. Animación (GSAP + Lenis)

Principio: **peaceful**. Movimiento lento y suave que acompaña; nada que rebote o distraiga.

- Lenis global, ScrollTrigger sincronizado.
- Títulos display: revelado por líneas con SplitText (máscara, `power3.out`, ~0.9s).
- Fotos: revelado con máscara en forma de **arco** (clip-path) + leve parallax.
- Secciones: fade/translate sutil en stagger.
- Preloader → hero: secuencia de la sección 1 ("Firma Nodo").
- Hero: pin + scrub, arco ojival que se expande a pantalla completa, título dividido.
- Modal de ministerio: entrada con escala/opacidad, foco atrapado.
- Header: se oculta al bajar y aparece al subir; cambia de transparente a crema.
- `prefers-reduced-motion`: desactiva Lenis y deja solo fades instantáneos.
- Todo vía `useGSAP` con cleanup; ScrollTrigger solo en client components hoja.

---

## 7. Calidad

- **Performance:** objetivo Lighthouse ≥ 95 móvil; LCP < 2.0s; JS de animación cargado solo donde se usa.
- **Accesibilidad:** WCAG 2.2 AA; tests con axe en Playwright; navegación por teclado; modales con `<dialog>` y foco.
- **SEO:** metadata por página y locale, `hreflang` alternates, sitemap bilingüe, JSON-LD `Church` (dirección, horarios), OG images.
- **Formularios:** honeypot + rate limit simple; validación zod en server.

---

## 8. Fases de trabajo

| # | Hito | Entregable |
|---|---|---|
| 0 | Setup ✅ | Repo local, Next.js + Tailwind v4 + next-intl, fuentes, tokens, lint/tests (revisión solo en local) |
| 1 | Sistema de diseño ✅ | Escala tipográfica, superficies (cream/white/green/ink), Button, TextLink, Container, Section, Placeholder, Logo, Wordmark, Modal; `/[locale]/dev/styleguide` (solo dev) |
| 2 | Layout ✅ | Header (transparente sobre hero oscuro → crema; se oculta al bajar), menú móvil (`<dialog>` verde), Footer con wordmark y crédito Nodo, LocaleSwitcher con slugs traducidos, skip link, Lenis + GSAP (`lib/motion`) |
| 3 | Capa de contenido | Schemas zod, `lib/content`, data (ministries, leaders, experiences, values, beliefs), traducción ES→EN del perfil institucional |
| 4 | Preloader + Hero | Preloader, transición del arco y hero pinned (con imágenes provisionales hasta tener las finales) |
| 4b | Home | Resto de secciones de Home |
| 5 | Páginas institucionales | Visit, About (+ History, DNA, Leadership), Community, Global |
| 6 | Ministries | Grilla + modal con URL propia (intercepting routes) |
| 7 | Events + Resources | MDX de eventos, listado/detalle, cron de revalidación; Resources con placeholders; Policies; Newsletters |
| 8 | Contact + forms | Formulario de contacto y newsletter con Resend |
| 9 | Pulido | Animaciones finas, SEO, a11y, performance, QA móvil, revisión de textos EN/ES |
| 10 | Lanzamiento | Pato conecta el proyecto a Vercel, dominio altar.org.nz, variables de entorno, redirects, analítica |

---

## 9. Decisiones abiertas

- [x] Fuente de cuerpo/UI: Inter (light 300 para párrafos)
- [x] Hay transmisión online → CTA "Watch online" en header/hero + sección Messages en Home + Sermons en Resources
- [ ] Plataforma y URL de la transmisión (YouTube, Facebook, Instagram Live…) y si es en vivo cada domingo o solo grabada
- [ ] Plataforma de newsletter (Resend Audiences vs. otra)
- [ ] Revisión por el cliente de la traducción EN
