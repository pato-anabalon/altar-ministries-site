# Altar Ministries — website

Bilingual (EN/ES) website for Altar Ministries, Ponsonby, Auckland. https://altar.org.nz

- Plan: [docs/PLAN-IMPLEMENTACION.md](docs/PLAN-IMPLEMENTACION.md)
- Open items: [docs/PENDIENTES.md](docs/PENDIENTES.md)
- Agent/contributor rules: [AGENTS.md](AGENTS.md)

## Develop

```bash
npm install
cp .env.example .env.local   # fill in RESEND_API_KEY
npm run dev                  # http://localhost:3000 → redirects to /en
npm run verify               # lint, typecheck, tests, build
```

Stack: Next.js 16, Tailwind CSS 4, next-intl, GSAP + Lenis, zod, Resend. Hosted on Vercel.

Built with 💚 by [Nodo.co.nz](https://nodo.co.nz).
