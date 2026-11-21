# Altar Ministries — Guía de lanzamiento (hito 10)

Pasos que hace Pato (cuentas, dominio, deploy). El código ya está listo para producción: `npm run verify` y `npm run test:e2e` pasan.

## 0. Antes de lanzar (bloqueantes)

- [ ] Política de privacidad publicada (los formularios de contacto y boletín la enlazan desde `/resources/policies`)
- [ ] Correo de destino confirmado (`CONTACT_TO_EMAIL`; hoy contact@altar.org.nz temporal)
- [ ] Revisión del cliente de los textos EN (y de los redactados por Nodo, ver `PENDIENTES.md`)
- [ ] Sin contenido `pending` que deba verse: en producción se oculta solo, revisar que no falte nada importante

## 1. Proyecto en Vercel

1. Importar `github.com/pato-anabalon/altar-ministries-site` (framework Next.js detectado; sin ajustes de build).
2. Node.js 24 (por defecto).
3. Activar **Web Analytics** y **Speed Insights** en el panel del proyecto (los componentes ya están en el layout).

## 2. Variables de entorno (Production)

| Variable | Valor |
|---|---|
| `RESEND_API_KEY` | Clave de Resend |
| `CONTACT_FROM_EMAIL` | `Altar Ministries <website@altar.org.nz>` (dominio verificado en Resend) |
| `CONTACT_TO_EMAIL` | Correo que recibe los mensajes |
| `RESEND_NEWSLETTER_SEGMENT_EN` / `_ES` | IDs de los segmentos (opcional: sin ellos, las suscripciones llegan por correo) |

Sin `RESEND_API_KEY` los formularios responden 503 en producción. En Preview se pueden dejar vacías.

## 3. Resend

1. Crear la cuenta y agregar el dominio `altar.org.nz`.
2. Cargar en el DNS los registros que indica Resend (SPF, DKIM y opcionalmente DMARC) y esperar la verificación.
3. Crear los segmentos EN y ES del boletín.

## 4. Dominio

1. En Vercel → Domains: agregar `altar.org.nz` y `www.altar.org.nz`, con `www` redirigiendo al dominio sin www.
2. En el DNS: registro `A` de `altar.org.nz` y `CNAME` de `www` según lo que muestre Vercel.
3. El certificado HTTPS lo emite Vercel solo.
4. Si hoy existe otro sitio en el dominio, pasar sus URLs antiguas para agregar redirecciones 301 en `next.config.ts` (`redirects`).

## 5. Después del deploy

- [ ] Abrir `/` (redirige a `/en` o `/es` según el navegador), `/sitemap.xml` y `/robots.txt`
- [ ] Enviar un mensaje de prueba desde `/en/contact` y una suscripción desde el boletín
- [ ] Probar preloader y hero en móvil real (iOS Safari y Android Chrome)
- [ ] Compartir un enlace (WhatsApp/Instagram) para ver la imagen OG
- [ ] Google Search Console: verificar el dominio y enviar `https://altar.org.nz/sitemap.xml`
- [ ] Validar el JSON-LD en el Rich Results Test de Google
- [ ] Revisar Speed Insights tras unos días de tráfico

## Ya resuelto en código

- Previews de Vercel fuera de buscadores: `robots.txt` bloquea todo si `VERCEL_ENV` no es `production`.
- Cabeceras de seguridad (`next.config.ts`): `nosniff`, sin iframes ajenos, `Referrer-Policy`, `Permissions-Policy`. HSTS lo pone Vercel.
- Eventos: Home y Events se regeneran cada 24 h (`revalidate = 86400`), así los eventos pasados salen solos.
- Páginas de desarrollo (`/dev/styleguide`) dan 404 en producción.
