/**
 * Caps a Mon Cheri font size so the longest word among `texts` always fits a phone screen.
 *
 * Mon Cheri capitals average ~0.94em per letter, so a word of n letters needs about n em; the cap
 * keeps that within the viewport minus the 16px gutters. On larger screens `base` wins. Spanish
 * carries long single words ("CONECTADOS", "EXPERIENCIAL", "PRINCIPALES") that would otherwise
 * push the page sideways. Pass every text that shares the size so they stay consistent.
 */
export function capToLongestWord(base: string, texts: string[]) {
  const longest = Math.max(1, ...texts.flatMap((text) => text.split(/\s+/)).map((word) => word.length));
  return `min(${base}, calc((100vw - 2rem) / ${longest}))`;
}
