/**
 * Our History timeline. `date` is ISO (year, year-month or full date) and drives order;
 * `dateLabel` is what visitors read. Undated milestones go last until the client confirms them.
 */
export const history = [
  {
    id: "first-gatherings",
    date: "2023-04-01",
    dateLabel: { en: "1 April 2023", es: "1 de abril de 2023" },
    description: {
      en: "First weekly gatherings at Juan Pablo and Natalie’s home.",
      es: "Primeras reuniones semanales en casa de Juan Pablo y Natalie.",
    },
  },
  {
    id: "nexus-initiative",
    date: null,
    dateLabel: { en: "Date to confirm", es: "Fecha por confirmar" },
    description: {
      en: "Altar is formalised as the first initiative of Nexus Initiative Trust.",
      es: "Altar se formaliza como la primera iniciativa de Nexus Initiative Trust.",
    },
    status: "pending",
  },
];
