import { archPath, heroWindow } from "./arch";

/**
 * The shape of the hero's window (and the preloader's opening): the gothic arch or a Latin cross.
 *
 * A shape is a list of numbers that `path` turns into an SVG path. Every shape has a `start` state
 * for a given frame and a `full` state that draws the plain full-screen rectangle. Because the
 * path's command structure never changes, the hero opens the window by interpolating the numbers
 * from start to full. Coordinates are 0–1 units of the frame (objectBoundingBox).
 */
export type WindowShape = {
  /** `anchor` (px in the frame, e.g. the T's crossbar) lets a shape centre itself on a point. */
  start: (width: number, height: number, anchor?: { x: number; y: number }) => number[];
  full: number[];
  path: (params: number[]) => string;
  /** Same params in pixels, for the preloader's full-screen SVG mask. */
  toPixels: (params: number[], width: number, height: number) => number[];
  /** Pixel params shrunk by `by` px on every edge (keeps the outline, moves each edge inward). */
  inset: (pixels: number[], by: number) => number[];
  /**
   * Point to grow the preloader opening from. Scaled about it, the shape stays inside its own
   * full-size outline at every step (for the cross: where the arms meet the upright).
   */
  pivot: (params: number[]) => { x: number; y: number };
};

const round = (n: number) => Math.round(n * 10000) / 10000;

/** Arch params: [x0, y0, x1, y1, s] (see arch.ts). */
const arch: WindowShape = {
  start: (width, height) => {
    const box = heroWindow(width, height);
    return [box.x0, box.y0, box.x1, box.y1, box.s];
  },
  full: [0, 0, 1, 1, 0],
  path: ([x0 = 0, y0 = 0, x1 = 1, y1 = 1, s = 0]) => archPath({ x0, y0, x1, y1, s }),
  toPixels: ([x0 = 0, y0 = 0, x1 = 1, y1 = 1, s = 0], width, height) => [x0 * width, y0 * height, x1 * width, y1 * height, s * height],
  inset: ([x0 = 0, y0 = 0, x1 = 0, y1 = 0, s = 0], by) => [x0 + by, y0 + by, x1 - by, y1 - by, s],
  pivot: ([x0 = 0, y0 = 0, x1 = 0, y1 = 0]) => ({ x: (x0 + x1) / 2, y: (y0 + y1) / 2 }),
};

/** Size of the cross window relative to its first version (0.65 = 35% smaller, less invasive). */
const CROSS_SCALE = 0.65;

const BAR_TOP = 0.22;
const BAR_BOTTOM = 0.44;

/**
 * Latin cross params: [x0, y0, x1, y1, stem, barTop, barBottom]. `stem` is the upright's width as
 * a share of the box width; the bar's edges are shares of the box height. At stem = 1 the cross is
 * a rectangle (the arms merge into the upright), which is how it opens into the full frame.
 */
const cross: WindowShape = {
  /**
   * With an anchor (the T's crossbar), the upright is centred on it and the arms' band is centred
   * on its height, so the window, the photo's cross and the T share one centre and one crossbar.
   * Without one it sits centred in the frame.
   */
  start: (width, height, anchor) => {
    const portrait = width < height;
    const crossHeight = height * (portrait ? 0.58 : 0.72) * CROSS_SCALE;
    const crossWidth = Math.min(crossHeight * 0.66, width * (portrait ? 0.82 : 0.46) * CROSS_SCALE);
    const centerX = anchor ? anchor.x : width / 2;
    const top = anchor ? anchor.y - crossHeight * ((BAR_TOP + BAR_BOTTOM) / 2) : height * (portrait ? 0.57 : 0.53) - crossHeight / 2;
    return [
      (centerX - crossWidth / 2) / width,
      top / height,
      (centerX + crossWidth / 2) / width,
      (top + crossHeight) / height,
      0.34,
      BAR_TOP,
      BAR_BOTTOM,
    ];
  },
  full: [0, 0, 1, 1, 1, BAR_TOP, BAR_BOTTOM],
  path: ([x0 = 0, y0 = 0, x1 = 1, y1 = 1, stem = 1, barTop = 0, barBottom = 0]) => {
    const half = ((x1 - x0) * stem) / 2;
    const cx = (x0 + x1) / 2;
    const left = cx - half;
    const right = cx + half;
    const top = y0 + (y1 - y0) * barTop;
    const bottom = y0 + (y1 - y0) * barBottom;
    const points = [
      [left, y1], [left, bottom], [x0, bottom], [x0, top], [left, top], [left, y0],
      [right, y0], [right, top], [x1, top], [x1, bottom], [right, bottom], [right, y1],
    ];
    return `M${points.map(([x = 0, y = 0]) => `${round(x)} ${round(y)}`).join(" L")} Z`;
  },
  toPixels: ([x0 = 0, y0 = 0, x1 = 1, y1 = 1, ...rest], width, height) => [x0 * width, y0 * height, x1 * width, y1 * height, ...rest],
  inset: ([x0 = 0, y0 = 0, x1 = 0, y1 = 0, stem = 1, barTop = 0, barBottom = 0], by) => {
    // Recompute the shares so the upright, the arms and the ends all move in by `by` px.
    const height = y1 - y0;
    const width = x1 - x0;
    const top = y0 + height * barTop;
    const bottom = y0 + height * barBottom;
    const insetHeight = height - by * 2;
    const insetWidth = width - by * 2;
    return [
      x0 + by,
      y0 + by,
      x1 - by,
      y1 - by,
      (width * stem - by * 2) / insetWidth,
      (top + by - (y0 + by)) / insetHeight,
      (bottom - by - (y0 + by)) / insetHeight,
    ];
  },
  pivot: ([x0 = 0, y0 = 0, x1 = 0, y1 = 0, , barTop = 0, barBottom = 0]) => ({
    x: (x0 + x1) / 2,
    y: y0 + (y1 - y0) * ((barTop + barBottom) / 2),
  }),
};

export const windowShapes = { arch, cross };

/** The shape used by the hero and the preloader. Switch to "arch" for the gothic window. */
export const HERO_WINDOW_SHAPE: keyof typeof windowShapes = "cross";
export const heroShape = windowShapes[HERO_WINDOW_SHAPE];

/** Server-rendered starting window (16:9 desktop), corrected on the client before anything shows. */
export const DEFAULT_WINDOW_PATH = heroShape.path(heroShape.start(1600, 900));

export function mixParams(from: number[], to: number[], k: number) {
  return from.map((value, index) => value + ((to[index] ?? value) - value) * k);
}

/** Centre of the window box in the same units as the params (for scaling the preloader opening). */
export function windowCenter(params: number[]) {
  const [x0 = 0, y0 = 0, x1 = 1, y1 = 1] = params;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, width: x1 - x0, height: y1 - y0 };
}
