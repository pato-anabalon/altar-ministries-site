import localFont from "next/font/local";
import { Inter, Playfair_Display } from "next/font/google";

/** Display: logo wordmark, H1, giant times. Brand font (TAN Mon Cheri), free for web use. */
export const monCheri = localFont({
  src: "./fonts/tan-mon-cheri-regular.woff2",
  variable: "--font-mon-cheri",
  display: "swap",
});

/** Secondary: short accents only (H3, numbers). Very heavy, use sparingly. */
export const tangkiwood = localFont({
  src: "./fonts/tan-tangkiwood-regular.woff2",
  variable: "--font-tangkiwood",
  display: "swap",
  preload: false,
});

/** Tertiary: H2, quotes, lead paragraphs. */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

/** Body and UI. Paragraphs use the light (300) weight. */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const fontVariables = [monCheri, tangkiwood, playfair, inter].map((f) => f.variable).join(" ");
