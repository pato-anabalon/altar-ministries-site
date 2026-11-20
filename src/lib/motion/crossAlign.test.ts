import { describe, expect, it } from "vitest";
import { alignCrossToGlyph, coverScale, crossOnScreen, finalCrossTransform, mixTransforms, withCover } from "./crossAlign";

describe("crossOnScreen", () => {
  it("finds the cross near the centre of a 16:9 frame", () => {
    const cross = crossOnScreen(1600, 900);
    expect(cross.x).toBeCloseTo(800, -1);
    expect(cross.y).toBeCloseTo(459, -1);
  });

  it("uses the portrait source on tall screens", () => {
    const cross = crossOnScreen(390, 844);
    expect(cross.x).toBeCloseTo(195, -1);
    expect(cross.barWidth).toBeGreaterThan(100);
  });
});

describe("alignCrossToGlyph", () => {
  it("moves the cross onto the T and matches the bar widths", () => {
    const cross = { x: 800, y: 460, barWidth: 140 };
    expect(alignCrossToGlyph(cross, { x: 790, y: 300, width: 168 })).toEqual({ x: -10, y: -160, scale: 1.2 });
  });

  it("never scales the photo below the frame or past 2.4×", () => {
    const cross = { x: 800, y: 460, barWidth: 140 };
    expect(alignCrossToGlyph(cross, { x: 800, y: 460, width: 40 }).scale).toBe(1);
    expect(alignCrossToGlyph(cross, { x: 800, y: 460, width: 2000 }).scale).toBe(2.4);
  });
});

describe("cover", () => {
  it("needs no extra scale when the photo is not moved", () => {
    expect(coverScale({ x: 0, y: 0, scale: 1 }, 1600, 900, { x: 800, y: 460 })).toBe(1);
  });

  it("keeps the frame covered once fully open, even with the photo lifted on phones", () => {
    const width = 390;
    const height = 844;
    const cross = crossOnScreen(width, height);
    const end = withCover(finalCrossTransform(width, height, cross), width, height, cross, 1);
    // Bottom edge of the scaled, lifted photo still reaches the bottom of the frame.
    expect(cross.y + (height - cross.y) * end.scale + end.y).toBeGreaterThanOrEqual(height - 0.001);
    expect(cross.y + end.y).toBeCloseTo(height * 0.36);
  });

  it("interpolates between start and end", () => {
    expect(mixTransforms({ x: 0, y: -100, scale: 1.2 }, { x: 0, y: 0, scale: 1 }, 0.5)).toEqual({ x: 0, y: -50, scale: 1.1 });
  });
});
