/**
 * Ministries shown in the grid (each opens as a modal with its own URL). `slug` is the URL segment
 * per language. `summary: null` means the client has not supplied the team description yet: the
 * page shows the shared "description coming soon" line instead of invented copy.
 * Altar Global and Missions & Church Planting live under Global, not here.
 */
export const ministries = [
  {
    id: "kids",
    group: "people",
    slug: { en: "kids", es: "ninos" },
    name: { en: "Altar Kids", es: "Altar Kids" },
    summary: null,
  },
  {
    id: "youth",
    group: "people",
    slug: { en: "youth", es: "jovenes" },
    name: { en: "Youth Ministry", es: "Ministerio de Jóvenes" },
    summary: {
      en: "A space for young people to connect, explore faith and grow together. Contact us for details and ways to take part.",
      es: "Un espacio para que los jóvenes se conecten, exploren la fe y crezcan juntos. Contáctanos para conocer los detalles y cómo participar.",
    },
    sections: [
      {
        title: { en: "Long-term youth leadership role", es: "Liderazgo juvenil a largo plazo" },
        body: {
          en: "We’re looking for a young leader, ideally bilingual in English and Spanish, to share the life of Christ with our young people.",
          es: "Buscamos a una persona joven para liderar, idealmente bilingüe en inglés y español, que comparta la vida de Cristo con nuestros jóvenes.",
        },
      },
    ],
  },
  {
    id: "women",
    group: "people",
    slug: { en: "women", es: "mujeres" },
    name: { en: "Women’s Ministry", es: "Ministerio de Mujeres" },
    summary: null,
    sections: [
      {
        title: { en: "Women’s gatherings", es: "Encuentros de mujeres" },
        body: {
          en: "Weekdays, during the day, in various locations. Call 0800 ALTAR NZ for the next time and place.",
          es: "Entre semana, durante el día, en distintos lugares. Llama al 0800 ALTAR NZ para conocer el próximo horario y lugar.",
        },
      },
    ],
  },
  {
    id: "men",
    group: "people",
    slug: { en: "men", es: "hombres" },
    name: { en: "Men’s Ministry", es: "Ministerio de Hombres" },
    summary: null,
  },
  {
    id: "worship",
    group: "serve",
    slug: { en: "worship", es: "adoracion" },
    name: { en: "Worship", es: "Adoración" },
    summary: {
      en: "Join us in Christ-centred worship. Get in touch to learn about serving with the worship team.",
      es: "Acompáñanos en la adoración centrada en Cristo. Contáctanos para saber cómo servir en el equipo de adoración.",
    },
  },
  {
    id: "prophetic",
    group: "serve",
    slug: { en: "prophetic", es: "profetico" },
    name: { en: "Prophetic Ministry", es: "Ministerio Profético" },
    summary: null,
  },
  {
    id: "media",
    group: "serve",
    slug: { en: "media", es: "medios" },
    name: { en: "Media", es: "Medios" },
    summary: null,
  },
  {
    id: "hospitality",
    group: "serve",
    slug: { en: "hospitality", es: "hospitalidad" },
    name: { en: "Hospitality", es: "Hospitalidad" },
    summary: null,
  },
  {
    id: "maintenance",
    group: "serve",
    slug: { en: "maintenance", es: "mantenimiento" },
    name: { en: "Maintenance", es: "Mantenimiento" },
    summary: null,
  },
  {
    id: "special-events",
    group: "serve",
    slug: { en: "special-events", es: "eventos-especiales" },
    name: { en: "Special Events", es: "Eventos Especiales" },
    summary: {
      en: "Explore upcoming church events and contact us to ask about helping with them.",
      es: "Explora los próximos eventos de la iglesia y contáctanos para saber cómo colaborar.",
    },
  },
];
