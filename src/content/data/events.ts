/**
 * Events. `start` is ISO 8601 with the Auckland offset; `precision` says how much of it is known
 * ("month" for past events with only a month). Upcoming vs past is decided at build time, and the
 * daily revalidation moves events across. An optional long description lives in
 * src/content/events/<id>.<locale>.mdx.
 */
export const events = [
  {
    id: "todo-por-amor-2026",
    slug: { en: "todo-por-amor-2026", es: "todo-por-amor-2026" },
    title: { en: "Todo Por Amor", es: "Todo Por Amor" },
    start: "2026-12-19T16:00:00+13:00",
    precision: "datetime",
    summary: {
      en: "A Christmas musical in Spanish and English.",
      es: "Un musical navideño en español e inglés.",
    },
  },
  {
    id: "church-opening-2026",
    slug: { en: "church-opening-2026", es: "inauguracion-iglesia-2026" },
    title: { en: "Church Opening", es: "Inauguración de la iglesia" },
    start: "2026-06-01T00:00:00+12:00",
    precision: "month",
  },
];
