/**
 * Global: the Altar network beyond Ponsonby (client prototype). Partners other than Nexus
 * Initiative Trust are "listed for review" by the client, so they stay pending.
 */
export const global = {
  community: {
    title: { en: "Global Community", es: "Comunidad global" },
    body: {
      en: "People who have taken part in Altar remain connected from the United States, Dominican Republic, Chile, Argentina, Colombia and Brazil.",
      es: "Personas que participaron de Altar siguen vinculadas desde Estados Unidos, República Dominicana, Chile, Argentina, Colombia y Brasil.",
    },
  },
  altarGlobal: {
    title: { en: "Altar Global", es: "Altar Global" },
    body: {
      en: "Stay connected with the Altar community across borders.",
      es: "Sigue conectado con la comunidad de Altar más allá de las fronteras.",
    },
  },
  missions: {
    title: { en: "Missions and Church Planting", es: "Misiones y Plantación de Iglesias" },
    body: {
      en: "Find out how to take part in missions and support the work of planting churches.",
      es: "Conoce cómo participar en misiones y apoyar la plantación de iglesias.",
    },
  },
  // Phase 2: filled in as the client approves each church and supporter.
  churches: [],
  supporters: [],
  partners: [
    {
      id: "nexus",
      name: "Nexus Initiative Trust",
      description: {
        en: "Provides the institutional framework for Altar Ministries.",
        es: "Da el marco institucional a Altar Ministries.",
      },
    },
    {
      id: "lapet",
      name: "LAPET",
      status: "pending",
    },
    {
      id: "pcanz",
      name: "Presbyterian Church of Aotearoa New Zealand",
      status: "pending",
    },
  ],
};
