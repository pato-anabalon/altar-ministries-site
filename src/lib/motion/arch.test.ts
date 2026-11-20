import { describe, expect, it } from "vitest";
import { archPath, FULL_FRAME, heroWindow } from "./arch";

const numbers = (d: string) => d.match(/-?\d+(\.\d+)?/g)!.map(Number);
const commands = (d: string) => d.replace(/[-\d.\s]+/g, "");

describe("archPath", () => {
  it("becomes a plain rectangle at full frame", () => {
    // Every top point (control points included) lies on y = 0: the top edge is a straight line.
    expect(archPath(FULL_FRAME)).toBe("M0 1 L0 0 C0 0 0.191 0 0.5 0 C0.809 0 1 0 1 0 L1 1 Z");
  });

  it("puts the point of the arch at the top centre", () => {
    const n = numbers(archPath({ x0: 0.2, y0: 0.1, x1: 0.6, y1: 0.9, s: 0.3 }));
    expect([n[8], n[9]]).toEqual([0.4, 0.1]);
  });

  it("keeps the same command structure at every size, so it can be tweened", () => {
    const shapes = [archPath(FULL_FRAME), archPath(heroWindow(1440, 900)), archPath(heroWindow(390, 844))];
    expect(new Set(shapes.map(commands)).size).toBe(1);
    expect(new Set(shapes.map((d) => numbers(d).length)).size).toBe(1);
  });
});

describe("heroWindow", () => {
  it("stays inside the viewport and centred horizontally", () => {
    for (const [w, h] of [[1440, 900], [2560, 1440], [390, 844], [820, 1180]] as const) {
      const box = heroWindow(w, h);
      expect(box.x0).toBeGreaterThan(0);
      expect(box.x1).toBeLessThan(1);
      expect(box.y0).toBeGreaterThan(0);
      expect(box.y1).toBeLessThan(1);
      expect(box.x0 + box.x1).toBeCloseTo(1);
      expect(box.y0 + box.s).toBeLessThan(box.y1);
    }
  });
});
