# Altar Ministries — Pendientes

Fuente: prototipo del cliente (`/en/review/`) + decisiones de estructura del 2026-11-20.

## Decisiones de estructura tomadas

- [x] Nueva arquitectura: Home · Visit Us · About · Ministries · Community · Global · Events · Resources (+ Give / Contact / EN-ES en header)
- [x] "Global" como sección propia (Missions & Church Planting, Our Churches, Global Community, Partners, Supporters)
- [x] "Institutional Profile" deja de ser página → PDF descargable (desde About)
- [x] Review guide y Editor demo fuera del sitio público
- [x] Se respetan las fases de lanzamiento definidas por el cliente
- [x] Ministerios como modal con URL propia (abre como modal desde la grilla; acceso directo renderiza página simple)

## Decisiones técnicas tomadas

- [x] Stack: Next.js + Tailwind + Vercel + GSAP (mismo stack de life-painting-site, nodo-site, etc.)
- [x] Sin CMS: contenido como código (MDX por idioma para Events/noticias/sermones, TS/JSON tipado con zod para datos estructurados)
- [x] Archivos pesados (audio, PDFs, fotos) en Vercel Blob; el contenido solo referencia URLs
- [x] Toda lectura de contenido pasa por `lib/content` para poder migrar a DB + admin propio en el futuro
- [ ] Panel admin solo en local (genera MDX + sube a Blob) — evaluar si publicar a mano se vuelve tedioso
- [x] Events: ISR diario (`revalidate = 86400` en Home y Events) mueve los eventos a "pasados" sin redeploy

## Fase 2 (después del lanzamiento)

Estructura lista con placeholders (hito 11). Para activar una página: cargar su material y quitar `status: "pending"` de su entrada en `src/content/data/pages.ts`.

| Página | Qué falta para activarla |
|---|---|
| Giving / Donations | Método de donación aprobado |
| Opportunities | Avisos aprobados y proceso de postulación |
| Our Churches | Perfiles y enlaces de cada iglesia |
| Supporters | Nombres, logos y permisos de uso |
| Bookshop | Plan de librería (modelo, catálogo, pagos) |

## Decisiones pendientes del cliente

- [ ] Idiomas de cada reunión
- [ ] Enlace de Zoom (Prayer Experience)
- [x] Email público de contacto: contact@altar.org.nz (confirmado 2026-11-22)
- [ ] Revisar perfil institucional 2026 y su traducción al inglés
- [ ] Aprobar identidad visual (logo, paleta, tipografías)
- [ ] Dominio (después de la presentación al cliente)
- [ ] Fotos, biografías, políticas, enlaces y archivos en ambos idiomas
- [ ] Método de donación
- [ ] Formato del newsletter global
- [ ] Relación con Partners in Faith (quiénes aparecen y cómo)
- [ ] Definir qué significa "On Track"

## Integraciones por definir

- [ ] Cuentas de editores / CMS y control de acceso
- [ ] Almacenamiento compartido (audios, PDFs, imágenes)
- [ ] Envío de formularios: Resend ya integrado; falta la cuenta, verificar el dominio altar.org.nz (remitente `CONTACT_FROM_EMAIL`), cargar las variables en Vercel (destino `CONTACT_TO_EMAIL` = contact@altar.org.nz, confirmado). Se hace después de la presentación al cliente
- [ ] Newsletter: crear los segmentos EN/ES en Resend (`RESEND_NEWSLETTER_SEGMENT_EN/_ES`), aprobar el texto de consentimiento y preparar la primera edición
- [ ] Calendario en vivo de eventos
- [ ] Redes sociales (Instagram y otras)
- [ ] Feeds de futuras iglesias plantadas

## Contenido requerido por página (lanzamiento)

| Página | Material que debe entregar el cliente |
|---|---|
| Home | Imagen hero y logo |
| Visit Us | Idiomas de reunión y enlace de Zoom |
| About Us / Our DNA | Perfil institucional 2026 |
| Our History | Hitos adicionales y fotos |
| Leadership | Biografías, fotos y relación institucional (Senior Leaders, Elders, Pastors in training) |
| Ministries (10) | Descripción y contacto de cada equipo: Kids, Youth (+ horarios), Women, Men, Worship, Prophetic, Media, Hospitality, Maintenance, Special Events |
| Community | Acceso a la despensa (Pantry) y detalles de Christmas Dinner |
| Global — Altar Global / Missions | Detalles del equipo y contacto |
| Global — Global Community | Formato del newsletter y primeras noticias |
| Global — Partners in Faith | Nombres y enlaces aprobados |
| Events | Fechas, detalles y calendario |
| Resources | Grabaciones aprobadas y archivos en ambos idiomas |
| Policies | Políticas bilingües aprobadas |
| Newsletters | Cuenta de mailing, texto de consentimiento y primera edición |
| Contact | Email público y destino del formulario |
| Institutional Profile (PDF) | Perfil institucional 2026 en EN y ES |

## Material provisional (reemplazar cuando llegue)

- [ ] Fotos originales sin marca de agua, alta resolución, algunas horizontales (hoy: 13 fotos de Instagram 1080×1350 con logo incrustado)
- [ ] Fotos y biografías de líderes (hoy: placeholder)
- [ ] Logo en SVG con la "A" con onda (hoy: PNG 6–9 en header/footer; "ALTAR" grande con TAN Mon Cheri)
- [x] Email de contacto definitivo: contact@altar.org.nz
- [x] Imágenes del hero (IA): `cross.png` (16:9; la 9:16 se recorta centrada), `auckland-desktop.png` (16:9, Sky Tower a la izquierda + Harbour Bridge a la derecha), `auckland-mobile.png` (9:16)
- [ ] Opcional: escalar ×1.5 el recorte 9:16 de la cruz (hoy 864×1536)
- [ ] Opcional: reemplazar Auckland por foto real equivalente (North Shore → CBD + Harbour Bridge, hora azul)
- [ ] Plataforma y URL de la transmisión online (hoy: "Watch online" apunta a Instagram; cambiar `streamUrl` en `src/lib/site.ts`)
- [x] Dirección y horario de la Sunday Experience: St Stephen's Presbyterian Church, 65 Jervois Road, Ponsonby · domingos, café 12 h, Experience 13 h (tomado del prototipo, `src/lib/site.ts`)
- [ ] Confirmar si se publica la dirección del Friday Home Experience (83A Seaview Road, Remuera): parece un domicilio particular
- [ ] Partners in Faith: LAPET y la Iglesia Presbiteriana de Aotearoa NZ aparecen "para revisión" en el prototipo; confirmar antes de publicarlos
- [ ] Christmas Dinner: detalles pendientes ("Pending confirmation" en el prototipo)
- [ ] Altar Kids, Prophetic, Women, Men, Media, Maintenance, Hospitality: descripción del equipo pendiente

- [ ] Revisión del cliente de textos redactados por Nodo (no venían en el prototipo): intro de Comunidad, intro de Global, aspiración en ES (armada desde los puntos del perfil). Están en `src/content/data/pages.ts`.
- [ ] Biografías de Juan Pablo y Natalie: marcadas `pending` (el prototipo pide aprobar la redacción); se ven en desarrollo, no en producción.
- [ ] Archivos de Resources (predicaciones, audios, audiolibros, PDFs) y documentos de Policies (EN/ES), para subir a Vercel Blob
- [ ] Política de privacidad y de cookies: necesarias antes de lanzar los formularios (contacto y boletín)
- [ ] Descripción larga, lugar e imagen de cada evento (hoy solo título, fecha y resumen)
- [ ] Perfil institucional en PDF (EN y ES) para la descarga desde About (pendiente: hoy solo existe el .md en ES)
- [ ] Preguntas frecuentes para Visit us (no venían en el material; no se inventaron)
- [ ] Fecha en que Altar se formalizó como iniciativa de Nexus Initiative Trust (hito del timeline, `pending`).

Todo el contenido del prototipo (EN + ES) quedó en `design-source/prototype/contenido-prototipo.md` (privado, no versionado).
- [ ] Revisión por el cliente de la traducción ES → EN

## Datos del proyecto

- Dominio: https://altar.org.nz
- Repo: https://github.com/pato-anabalon/altar-ministries-site
- Instagram: https://www.instagram.com/altar.ministries/
- Fuentes: TAN Mon Cheri + TAN Tangkiwood (`public/fonts`, uso web libre) + Playfair Display + Inter (cuerpo/UI)

## Siguiente etapa

- [x] Arquitectura técnica, librerías, animaciones y referencias → ver [PLAN-IMPLEMENTACION.md](./PLAN-IMPLEMENTACION.md)
