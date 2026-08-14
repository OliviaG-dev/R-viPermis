import { describe, it, expect } from "vitest";
import { shuffle, shuffleArray, calculateScore } from "./index";

describe("utils/shuffle", () => {
  it("renvoie un nouveau tableau avec les mêmes éléments", () => {
    const source = [1, 2, 3, 4];
    const shuffled = shuffle(source);

    expect(shuffled).not.toBe(source);
    expect(shuffled.sort()).toEqual([...source].sort());
  });

  it("ne mute pas le tableau d'origine", () => {
    const source = [1, 2, 3];
    shuffle(source);
    expect(source).toEqual([1, 2, 3]);
  });

  it("retourne une copie pour un tableau vide ou à un élément", () => {
    const empty: number[] = [];
    const single = [42];

    expect(shuffle(empty)).toEqual([]);
    expect(shuffle(empty)).not.toBe(empty);
    expect(shuffle(single)).toEqual([42]);
    expect(shuffle(single)).not.toBe(single);
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

  it("retourne 0 ou 100 aux bornes", () => {
    expect(calculateScore(0, 5)).toBe(0);
    expect(calculateScore(5, 5)).toBe(100);
  });

  it("retourne 0 si le total est nul ou négatif", () => {
    expect(calculateScore(1, 0)).toBe(0);
    expect(calculateScore(2, -4)).toBe(0);
  });
});

