/**
 * The pointed (gothic) arch of St Stephen's windows and the "A" of the logo, as an SVG path.
 *
 * x0/y0/x1/y1 is the bounding box and `s` the height of the pointed top. With s = 0 and the box
 * at full size the same path is a plain rectangle, and because the command structure never
 * changes, any state in between is a valid shape: the hero tweens these numbers to open the
 * arch into a full-screen frame.
 */
export type ArchBox = { x0: number; y0: number; x1: number; y1: number; s: number };

export const FULL_FRAME: ArchBox = { x0: 0, y0: 0, x1: 1, y1: 1, s: 0 };

const round = (n: number) => Math.round(n * 10000) / 10000;

/*
 * Each side is one cubic Bézier approximating a 60° circular arc whose radius is the full width
 * (an equilateral gothic arch): vertical at the springing line, meeting its mirror in a point at
 * the top. The constants are that arc's control points expressed as fractions of the half-width
 * and of `s`, so the shape stays true at any size and flattens into a rectangle as s → 0.
 */
export function archPath({ x0, y0, x1, y1, s }: ArchBox): string {
  const half = (x1 - x0) / 2;
  const xm = x0 + half;
  const spring = y0 + s;
  const n = [
    x0, y1,
    x0, spring,
    x0, y0 + s * 0.588, x0 + half * 0.382, y0 + s * 0.207, xm, y0,
    x1 - half * 0.382, y0 + s * 0.207, x1, y0 + s * 0.588, x1, spring,
    x1, y1,
  ].map(round);
  return `M${n[0]} ${n[1]} L${n[2]} ${n[3]} C${n[4]} ${n[5]} ${n[6]} ${n[7]} ${n[8]} ${n[9]} C${n[10]} ${n[11]} ${n[12]} ${n[13]} ${n[14]} ${n[15]} L${n[16]} ${n[17]} Z`;
}

/**
 * The hero's arch window for a viewport, in 0–1 units of that viewport. Landscape: centred, about
 * 62% of the height. Portrait (phones): wider and lower, leaving the top for the ALTAR wordmark.
 */
export function heroWindow(width: number, height: number): ArchBox {
  const portrait = width < height;
  const archHeight = height * (portrait ? 0.5 : 0.62);
  const archWidth = Math.min(archHeight * 0.64, width * (portrait ? 0.72 : 0.4));
  const centerY = portrait ? 0.6 : 0.54;
  return {
    x0: 0.5 - archWidth / 2 / width,
    x1: 0.5 + archWidth / 2 / width,
    y0: centerY - archHeight / 2 / height,
    y1: centerY + archHeight / 2 / height,
    // Equilateral arch: the pointed top rises 0.866 × the width above the springing line.
    s: (archWidth * 0.866) / height,
  };
}

/** Server-rendered starting window (16:9 desktop), corrected on the client before anything shows. */
export const DEFAULT_HERO_WINDOW = heroWindow(1600, 900);
