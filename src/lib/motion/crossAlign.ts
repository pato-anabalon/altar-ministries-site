/**
 * Lines the cross in the hero photo up with the T of ALTAR.
 *
 * The cross photo fills the hero with object-fit: cover. Knowing where the cross sits inside each
 * source image (measured on the files in public/images/hero), we can tell where it lands on screen
 * and work out the transform that puts its stem under the T's stem and its crossbar on the T's bar,
 * scaled so both bars share a width. Scrolling then eases that transform back to the plain frame.
 */
type CrossSpec = {
  /** Source image size in px. */
  width: number;
  height: number;
  /** Stem centre (x) and crossbar centre (y), as fractions of the image. */
  x: number;
  y: number;
  /** Crossbar length as a fraction of the image width. */
  barWidth: number;
};

/** cross-mobile.jpg is a centred 864px-wide crop of cross-desktop.jpg (same pixels). */
export const CROSS_IN_IMAGE: Record<"landscape" | "portrait", CrossSpec> = {
  landscape: { width: 2752, height: 1536, x: 0.4996, y: 0.5104, barWidth: 0.089 },
  portrait: { width: 864, height: 1536, x: 0.4988, y: 0.5104, barWidth: 0.2836 },
};

export type Point = { x: number; y: number };
export type GlyphBar = Point & { width: number };
export type CrossTransform = { x: number; y: number; scale: number };

/** Where the cross lands in a W×H frame filled with object-fit: cover (centred). */
export function crossOnScreen(width: number, height: number) {
  const spec = width >= height ? CROSS_IN_IMAGE.landscape : CROSS_IN_IMAGE.portrait;
  const cover = Math.max(width / spec.width, height / spec.height);
  const offsetX = (width - spec.width * cover) / 2;
  const offsetY = (height - spec.height * cover) / 2;
  return {
    x: offsetX + spec.x * spec.width * cover,
    y: offsetY + spec.y * spec.height * cover,
    barWidth: spec.barWidth * spec.width * cover,
  };
}

/**
 * Transform (about the cross point as origin) that moves the cross onto the T and matches the bar
 * widths. The scale is clamped so an odd font measurement can never blow the photo up or shrink it
 * below the frame.
 */
export function alignCrossToGlyph(cross: ReturnType<typeof crossOnScreen>, glyph: GlyphBar): CrossTransform {
  const scale = Math.min(2.4, Math.max(1, glyph.width / cross.barWidth));
  return { x: glyph.x - cross.x, y: glyph.y - cross.y, scale };
}

/**
 * Final frame. Landscape: the plain photo. Portrait: the cross sits low in the image, right where
 * the title lands, so it is lifted to ~36% of the height (withCover then scales it enough to keep
 * the frame filled).
 */
export function finalCrossTransform(width: number, height: number, cross: ReturnType<typeof crossOnScreen>): CrossTransform {
  if (width >= height) return { x: 0, y: 0, scale: 1 };
  return { x: width / 2 - cross.x, y: height * 0.36 - cross.y, scale: 1 };
}

export function mixTransforms(from: CrossTransform, to: CrossTransform, k: number): CrossTransform {
  return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k, scale: from.scale + (to.scale - from.scale) * k };
}

/** Smallest scale (about the cross point) that keeps a moved photo covering the whole frame. */
export function coverScale(t: CrossTransform, width: number, height: number, cross: Point) {
  return Math.max(
    1,
    (cross.x + t.x) / cross.x,
    (width - cross.x - t.x) / (width - cross.x),
    (cross.y + t.y) / cross.y,
    (height - cross.y - t.y) / (height - cross.y),
  );
}

/**
 * Enforces coverage in proportion to how far the arch has opened (`weight` 0–1): while the arch is
 * small its clip hides the photo's edges, so the T alignment keeps its exact scale; by the time the
 * frame is full the photo always covers it.
 */
export function withCover(t: CrossTransform, width: number, height: number, cross: Point, weight: number): CrossTransform {
  const needed = coverScale(t, width, height, cross);
  return { ...t, scale: Math.max(t.scale, 1 + (needed - 1) * weight) };
}
