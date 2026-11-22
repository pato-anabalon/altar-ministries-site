/** Site-wide facts. Temporary values are marked; see docs/PENDIENTES.md. */
export const site = {
  name: "Altar Ministries",
  url: "https://altar.org.nz",
  /** Confirmed by the client (2026-11-22). */
  email: "contact@altar.org.nz",
  instagram: "https://www.instagram.com/altar.ministries/",
  /** Temporary: points to Instagram until the client confirms the streaming platform and URL. */
  streamUrl: "https://www.instagram.com/altar.ministries/",
  /** Sunday Experience venue (from the client's prototype, 2026-11-20). */
  venue: {
    name: "St Stephen's Presbyterian Church",
    streetAddress: "65 Jervois Road",
    suburb: "Ponsonby, Auckland",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=St+Stephen%27s+Presbyterian+Church%2C+65+Jervois+Road%2C+Ponsonby%2C+Auckland",
  },
  /** Sunday Experience in 24 h Auckland time, for structured data (the pages show `pages.visit` times). */
  sunday: { coffee: "12:00", start: "13:00" },
  /** Phone numbers as the client writes them; `href` is the dialable form. */
  phones: [
    { label: "0800 ALTAR NZ", href: "tel:+648002582769" },
    { label: "021 860 501", href: "tel:+6421860501" },
  ],
  /** Footer credit link; the surrounding words ("Built with 💚 by") are translated in messages. */
  credit: { label: "Nodo.co.nz", href: "https://nodo.co.nz" },
} as const;
