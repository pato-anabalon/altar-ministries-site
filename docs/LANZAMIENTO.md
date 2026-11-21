# Altar Ministries — Guía de lanzamiento (hito 10)

Pasos que hace Pato (cuentas, dominio, deploy). El código ya está listo para producción: `npm run verify` y `npm run test:e2e` pasan.

## Ramas y ambientes

| Rama | Ambiente | Vercel | URL |
|---|---|---|---|
| `main` | Producción | Production | `altar.org.nz` |
| `develop` | Test (revisión del cliente) | Preview | `test.altar.org.nz` (o la URL fija de rama `…-git-develop-….vercel.app`) |

Flujo: el trabajo entra a `develop`, se revisa en test y se lleva a `main` con un PR `develop → main`. Cada push a `main` publica producción.

Diferencias de test respecto a producción (automáticas, según `VERCEL_ENV`):
- `robots.txt` bloquea todo: test no aparece en buscadores.
- El contenido `pending` (datos por confirmar) se ve en test para que el cliente lo revise en contexto; en producción se oculta.

## 0. Antes de lanzar (bloqueantes)

- [ ] Política de privacidad publicada (los formularios de contacto y boletín la enlazan desde `/resources/policies`)
- [ ] Correo de destino confirmado (`CONTACT_TO_EMAIL`; hoy contact@altar.org.nz temporal)
- [ ] Revisión del cliente de los textos EN (y de los redactados por Nodo, ver `PENDIENTES.md`)
- [ ] Sin contenido `pending` que deba verse: en producción se oculta solo, revisar que no falte nada importante

## 1. Proyecto en Vercel

1. Importar `github.com/pato-anabalon/altar-ministries-site` (framework Next.js detectado; sin ajustes de build).
2. Node.js 24 (por defecto).
3. Settings → Environments → Production: **Branch Tracking** en `main` (es lo habitual; confirmarlo).
4. Settings → Deployment Protection: decidir el acceso a test. Con Vercel Authentication activa, el cliente necesita cuenta en Vercel; para que lo vea sin cuenta, usar un **Shareable Link** o protección por contraseña en vez de desactivarla.
5. Activar **Web Analytics** y **Speed Insights** en el panel del proyecto (los componentes ya están en el layout). Las métricas de producción y de preview se ven por separado.
6. Opcional: en GitHub, proteger `main` (solo merge por PR).

## 2. Variables de entorno

En Vercel cada variable se asigna a un ambiente; las de test van en **Preview** limitadas a la rama `develop`.

| Variable | Production (`main`) | Preview → `develop` |
|---|---|---|
| `RESEND_API_KEY` | Clave de Resend | La misma clave (o una de prueba) |
| `CONTACT_FROM_EMAIL` | `Altar Ministries <website@altar.org.nz>` | El mismo remitente |
| `CONTACT_TO_EMAIL` | Correo de la iglesia | Correo del equipo Nodo, para que las pruebas no lleguen a la iglesia |
| `RESEND_NEWSLETTER_SEGMENT_EN` / `_ES` | IDs de los segmentos | Vacías: en test las suscripciones llegan como aviso a `CONTACT_TO_EMAIL` y no ensucian la lista real |

Sin `RESEND_API_KEY` los formularios responden 503 en cualquier deploy de Vercel (también en test). Los previews de otras ramas no reciben estas variables si quedan limitadas a `develop`.

## 3. Resend

1. Crear la cuenta y agregar el dominio `altar.org.nz`.
2. Cargar en el DNS los registros que indica Resend (SPF, DKIM y opcionalmente DMARC) y esperar la verificación.
3. Crear los segmentos EN y ES del boletín.

## 4. Dominio

1. En Vercel → Domains: agregar `altar.org.nz` y `www.altar.org.nz`, con `www` redirigiendo al dominio sin www.
2. Agregar `test.altar.org.nz` y en sus opciones asignarlo a la rama `develop` (Git Branch).
3. En el DNS: registro `A` de `altar.org.nz` y `CNAME` de `www` y `test` según lo que muestre Vercel.
4. El certificado HTTPS lo emite Vercel solo.
5. Si hoy existe otro sitio en el dominio, pasar sus URLs antiguas para agregar redirecciones 301 en `next.config.ts` (`redirects`).

## 5. Después del deploy

Primero en test (`develop`), luego en producción (`main`):

- [ ] Abrir `/` (redirige a `/en` o `/es` según el navegador), `/sitemap.xml` y `/robots.txt`
- [ ] Enviar un mensaje de prueba desde `/en/contact` y una suscripción desde el boletín
- [ ] Probar preloader y hero en móvil real (iOS Safari y Android Chrome)
- [ ] Compartir un enlace (WhatsApp/Instagram) para ver la imagen OG
- [ ] Google Search Console: verificar el dominio y enviar `https://altar.org.nz/sitemap.xml`
- [ ] Validar el JSON-LD en el Rich Results Test de Google
- [ ] Revisar Speed Insights tras unos días de tráfico

## Ya resuelto en código

- Test y previews fuera de buscadores: `robots.txt` bloquea todo si `VERCEL_ENV` no es `production`.
- Contenido `pending` visible en test y oculto en producción (`isPublished` en `src/lib/content/localized.ts`).
- Cabeceras de seguridad (`next.config.ts`): `nosniff`, sin iframes ajenos, `Referrer-Policy`, `Permissions-Policy`. HSTS lo pone Vercel.
- Eventos: Home y Events se regeneran cada 24 h (`revalidate = 86400`), así los eventos pasados salen solos.
- Páginas de desarrollo (`/dev/styleguide`) dan 404 en producción.
