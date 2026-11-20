/**
 * The church's gatherings, called Experiences (institutional profile 2026 + client prototype).
 * Order is the order shown on Visit us and the Home grid.
 */
export const experiences = [
  {
    id: "sunday",
    name: { en: "Sunday Experience", es: "Experiencia del domingo" },
    summary: {
      en: "We worship, share the Word, build community and put our faith into practice.",
      es: "Adoramos, compartimos la Palabra, cultivamos comunidad y ponemos la fe en práctica.",
    },
    schedule: { en: "Every Sunday · 12–4 pm", es: "Todos los domingos · 12–16 h" },
    location: {
      en: "St Stephen’s Presbyterian Church, 65 Jervois Road, Ponsonby",
      es: "St Stephen’s Presbyterian Church, 65 Jervois Road, Ponsonby",
    },
    details: {
      en: "Join us at noon for coffee. Our Sunday Experience starts at 1 pm, and afterwards we share a bite together. You’re welcome to bring something to share. We’re a lively church and you’re welcome to join in. From time to time we have a joint Sunday service at 10 am. Give us a call to check the date.",
      es: "Nos encontramos al mediodía para tomar un café. A las 13 h comienza nuestra Experiencia del domingo y al final compartimos algo para comer. Si quieres, puedes traer algo para picar. Somos una iglesia muy activa y puedes participar con libertad. De vez en cuando tenemos un culto conjunto el domingo a las 10 h. Llámanos para confirmar la fecha.",
    },
  },
  {
    id: "friday-home",
    name: { en: "Friday Home Experience", es: "Experiencia en casa del viernes" },
    summary: {
      en: "We pray, worship and practise discipleship together. Participants can prepare a reflection, share it and receive feedback as they grow in sharing the gospel, exercising spiritual gifts and bearing the fruit of the Spirit.",
      es: "Oramos, adoramos y practicamos el discipulado juntos. Los participantes pueden preparar una reflexión, compartirla y recibir retroalimentación mientras crecen en el anuncio del evangelio, el ejercicio de los dones y el fruto del Espíritu.",
    },
    schedule: { en: "Every Friday · 7 pm", es: "Todos los viernes · 19 h" },
    // The prototype lists a street address that looks like a private home: suburb only until confirmed.
    location: { en: "Remuera · contact us for the address", es: "Remuera · consúltanos por la dirección" },
    details: {
      en: "We share some food together, then spend time in the Word, sharing testimonies and praying.",
      es: "Compartimos algo para comer y luego un tiempo de Palabra, testimonios y oración.",
    },
  },
  {
    id: "prayer",
    name: { en: "Prayer Experience", es: "Experiencia de oración" },
    summary: {
      en: "We make time for intercession, prophetic direction and seeking the Holy Spirit.",
      es: "Dedicamos tiempo a la intercesión, la dirección profética y la búsqueda del Espíritu Santo.",
    },
    schedule: { en: "Every Wednesday · 8 pm", es: "Todos los miércoles · 20 h" },
    location: { en: "Online · contact us for the Zoom link", es: "En línea · consúltanos por el enlace de Zoom" },
    details: {
      en: "On Wednesdays in the first and third weeks of each month, we also fast throughout the day.",
      es: "Los miércoles de la primera y tercera semana de cada mes también ayunamos durante todo el día.",
    },
  },
  {
    id: "community",
    name: { en: "Community Experience", es: "Experiencia comunitaria" },
    summary: {
      en: "We serve through the Church Pantry, migrant support and practical help.",
      es: "Servimos mediante la despensa de la iglesia, el acompañamiento a migrantes y la ayuda práctica.",
    },
  },
  {
    id: "fasting",
    name: { en: "Annual 21 days of fasting", es: "Ayuno anual de 21 días" },
    summary: {
      en: "Our annual church-wide fast brings together daily devotionals and prayer for local and global needs.",
      es: "Nuestro ayuno congregacional anual incluye devocionales diarios y oración por necesidades locales y globales.",
    },
  },
];
