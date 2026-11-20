import type { GlyphBar } from "./crossAlign";

/**
 * Layout position of `element` inside `ancestor`, summing offsets up the offsetParent chain.
 * Layout boxes ignore CSS transforms, so the letters' own animation never skews the measurement.
 */
export function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  for (let node: HTMLElement | null = element; node && node !== ancestor; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y };
}

/**
 * The T's crossbar in `frame` coordinates: centre x, bar y and bar width, from the font's real
 * metrics (canvas) and the letter's layout box. Shared by the hero and the preloader so the window,
 * the photo's cross and the T all line up on the same point.
 */
export function measureGlyphBar(letter: HTMLElement, frame: HTMLElement): GlyphBar {
  const style = getComputedStyle(letter);
  const size = parseFloat(style.fontSize);
  const origin = offsetWithin(letter, frame);
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return { x: origin.x + letter.offsetWidth / 2, y: origin.y, width: letter.offsetWidth };
  context.font = `${style.fontStyle} ${style.fontWeight} ${size}px ${style.fontFamily}`;
  const m = context.measureText("T");
  const baseline = origin.y + (letter.offsetHeight - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
  const left = origin.x - m.actualBoundingBoxLeft;
  const right = origin.x + m.actualBoundingBoxRight;
  // The bar is a hairline at the top of the glyph: aim at its middle.
  return { x: (left + right) / 2, y: baseline - m.actualBoundingBoxAscent + size * 0.02, width: right - left };
}
