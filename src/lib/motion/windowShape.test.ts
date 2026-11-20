import { describe, expect, it } from "vitest";
import { mixParams, windowShapes } from "./windowShape";

const numbers = (d: string) => d.match(/-?\d+(\.\d+)?/g)!.map(Number);
const commands = (d: string) => d.replace(/[-\d.\s]+/g, "");

describe.each(Object.entries(windowShapes))("%s window", (_name, shape) => {
  it("draws the full-screen rectangle at the end", () => {
    const points = numbers(shape.path(shape.full));
    const xs = points.filter((_, index) => index % 2 === 0);
    const ys = points.filter((_, index) => index % 2 === 1);
    expect(Math.min(...xs)).toBe(0);
    expect(Math.max(...xs)).toBe(1);
    expect(Math.min(...ys)).toBe(0);
    expect(Math.max(...ys)).toBe(1);
  });

  it("keeps the same path structure from start to full, so it can be tweened", () => {
    const states = [0, 0.3, 0.7, 1].map((k) => shape.path(mixParams(shape.start(1440, 900), shape.full, k)));
    expect(new Set(states.map(commands)).size).toBe(1);
    expect(new Set(states.map((d) => numbers(d).length)).size).toBe(1);
  });

  it.each([
    [1440, 900],
    [390, 844],
  ])("starts inside a %i×%i frame", (width, height) => {
    const points = numbers(shape.path(shape.start(width, height)));
    expect(Math.min(...points)).toBeGreaterThan(0);
    expect(Math.max(...points)).toBeLessThan(1);
  });
});

describe("inset", () => {
  it("moves every edge of the cross inward by the given pixels", () => {
    const shape = windowShapes.cross;
    const pixels = shape.toPixels(shape.start(1440, 900), 1440, 900);
    const outer = numbers(shape.path(pixels));
    const inner = numbers(shape.path(shape.inset(pixels, 1.5)));
    // Vertex order (see path): stem-left bottom, arm bottom-left, … Each x/y moves 1.5px toward the inside.
    const inward = [1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5];
    inner.forEach((value, index) => expect(value - (outer[index] ?? 0)).toBeCloseTo(inward[index] ?? 0, 3));
  });
});

describe("preloader opening", () => {
  it.each([0.1, 0.35, 0.6, 0.85, 1])("stays inside the hero's cross window while growing (scale %f)", (scale) => {
    const shape = windowShapes.cross;
    const window = shape.toPixels(shape.start(1440, 900, { x: 700, y: 330 }), 1440, 900);
    const [x0 = 0, y0 = 0, x1 = 0, y1 = 0, stem = 0, barTop = 0, barBottom = 0] = window;
    const cx = (x0 + x1) / 2;
    const half = ((x1 - x0) * stem) / 2;
    const armsTop = y0 + (y1 - y0) * barTop;
    const armsBottom = y0 + (y1 - y0) * barBottom;
    const inside = (x: number, y: number) =>
      (Math.abs(x - cx) <= half + 1e-6 && y >= y0 - 1e-6 && y <= y1 + 1e-6) ||
      (x >= x0 - 1e-6 && x <= x1 + 1e-6 && y >= armsTop - 1e-6 && y <= armsBottom + 1e-6);

    const pivot = shape.pivot(window);
    const opening = numbers(shape.path(shape.inset(window, 1.5)));
    for (let index = 0; index < opening.length; index += 2) {
      const x = pivot.x + ((opening[index] ?? 0) - pivot.x) * scale;
      const y = pivot.y + ((opening[index + 1] ?? 0) - pivot.y) * scale;
      expect(inside(x, y)).toBe(true);
    }
  });
});

describe("cross window", () => {
  it("centres its upright and its arms on the anchor (the T's crossbar)", () => {
    const [x0 = 0, y0 = 0, x1 = 0, y1 = 0, , barTop = 0, barBottom = 0] = windowShapes.cross.start(1440, 900, { x: 700, y: 330 });
    expect(((x0 + x1) / 2) * 1440).toBeCloseTo(700);
    const armsCentre = (y0 + (y1 - y0) * ((barTop + barBottom) / 2)) * 900;
    expect(armsCentre).toBeCloseTo(330);
  });

  it("is a rectangle once the upright is as wide as the box", () => {
    const d = windowShapes.cross.path([0, 0, 1, 1, 1, 0.22, 0.44]);
    // Every vertex sits on the frame's edge: arms merged into the upright.
    const points = numbers(d);
    for (let index = 0; index < points.length; index += 2) {
      const [x, y] = [points[index], points[index + 1]];
      expect(x === 0 || x === 1 || y === 0 || y === 1).toBe(true);
    }
  });
});
