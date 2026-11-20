import { describe, expect, it } from "vitest";
import { capToLongestWord } from "./fitText";

describe("capToLongestWord", () => {
  it("caps the size by the longest word across all texts", () => {
    expect(capToLongestWord("2rem", ["Seguimos conectados"])).toBe("min(2rem, calc((100vw - 2rem) / 10))");
    expect(capToLongestWord("3rem", ["Family", "De Brazos Abiertos", "Experiencial"])).toBe("min(3rem, calc((100vw - 2rem) / 12))");
  });

  it("never divides by zero", () => {
    expect(capToLongestWord("2rem", [""])).toBe("min(2rem, calc((100vw - 2rem) / 1))");
  });
});
