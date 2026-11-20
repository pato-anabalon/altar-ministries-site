/**
 * Resources: the kinds of material the client plans to publish (prototype), and the governance
 * documents listed on Policies. No files are supplied yet: `files` stays empty and the pages say
 * "coming soon". A file is { language, label, url } (Vercel Blob URL), paired EN/ES where possible.
 */
export const resourceCategories = [
  {
    id: "sermons",
    name: { en: "Sermons", es: "Predicaciones" },
    description: { en: "Messages from our Sunday Experience.", es: "Mensajes de nuestra Experiencia del domingo." },
    files: [],
  },
  {
    id: "audio",
    name: { en: "Audio", es: "Audios" },
    description: { en: "Teaching and worship to listen to anywhere.", es: "Enseñanza y adoración para escuchar donde estés." },
    files: [],
  },
  {
    id: "audiobooks",
    name: { en: "Audiobooks", es: "Audiolibros" },
    description: { en: "Books read aloud, in English and Spanish.", es: "Libros narrados, en inglés y español." },
    files: [],
  },
  {
    id: "pdfs",
    name: { en: "PDFs", es: "PDFs" },
    description: { en: "Free documents to read and share.", es: "Documentos gratuitos para leer y compartir." },
    files: [],
  },
];

/** Governance documents (prototype list, "Our Governance Framework"). Spanish names by Nodo. */
export const policies = [
  { id: "annual-report", name: { en: "Annual report", es: "Informe anual" }, files: [] },
  { id: "corporate-governance", name: { en: "Corporate governance", es: "Gobierno corporativo" }, files: [] },
  { id: "child-safety", name: { en: "Child safety", es: "Protección infantil" }, files: [] },
  { id: "cookie-policy", name: { en: "Cookie policy", es: "Política de cookies" }, files: [] },
  { id: "financial-character", name: { en: "Financial character", es: "Carácter financiero" }, files: [] },
  { id: "privacy-policy", name: { en: "Privacy policy", es: "Política de privacidad" }, files: [] },
  { id: "reporting-a-concern", name: { en: "Reporting a concern", es: "Cómo reportar una inquietud" }, files: [] },
  { id: "wills-and-bequests", name: { en: "Wills and bequests", es: "Testamentos y legados" }, files: [] },
];
