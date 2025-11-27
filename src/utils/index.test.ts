import { describe, it, expect } from "vitest";
import { shuffle, shuffleArray, calculateScore } from "./index";

describe("utils/shuffle", () => {
  it("renvoie un nouveau tableau avec les mêmes éléments", () => {
    const source = [1, 2, 3, 4];
    const shuffled = shuffle(source);

    expect(shuffled).not.toBe(source);
    expect(shuffled.sort()).toEqual([...source].sort());
  });

  it("shuffleArray délègue à shuffle", () => {
    const data = ["a", "b", "c"];
    const shuffled = shuffleArray(data);

    expect(shuffled.sort()).toEqual([...data].sort());
  });
});

describe("utils/calculateScore", () => {
  it("retourne un pourcentage arrondi", () => {
    expect(calculateScore(3, 5)).toBe(60);
    expect(calculateScore(1, 3)).toBe(33);
  });
});

