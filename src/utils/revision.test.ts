import { describe, expect, it } from "vitest";
import { formatAnswer, getMobileThemeLabel } from "./revision";

describe("getMobileThemeLabel", () => {
  it("raccourcit les vérifications intérieures", () => {
    expect(getMobileThemeLabel("Vérifications intérieures")).toBe("Interne");
  });

  it("raccourcit les vérifications extérieures", () => {
    expect(getMobileThemeLabel("Vérifications extérieures")).toBe("Externe");
  });

  it("laisse inchangé un thème sans intérieur ni extérieur", () => {
    expect(getMobileThemeLabel("Sécurité routière")).toBe("Sécurité routière");
  });

  it("retourne une chaîne vide si le thème est vide", () => {
    expect(getMobileThemeLabel("")).toBe("");
  });
});

describe("formatAnswer", () => {
  it("retourne une réponse unique telle quelle", () => {
    expect(formatAnswer("50 km/h")).toBe("50 km/h");
  });

  it("joint les réponses multiples avec un saut de ligne", () => {
    expect(formatAnswer(["Le 15", "Le 112"])).toBe("Le 15\nLe 112");
  });

  it("retourne une chaîne vide pour un tableau vide", () => {
    expect(formatAnswer([])).toBe("");
  });
});
