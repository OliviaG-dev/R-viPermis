import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../../test/renderWithRouter";

vi.mock("../../data/questions", async () => {
  const { revisionQuestions: questions } = await import(
    "../../test/fixtures/revisionQuestions"
  );
  return { questions };
});

import Revision from "./Revision";

describe("Revision page", () => {
  it("affiche la première question et le compteur", () => {
    renderWithRouter(<Revision />);

    expect(
      screen.getByRole("heading", { name: /Révision du Permis/ })
    ).toBeInTheDocument();
    expect(screen.getByText("Question 1 / 2")).toBeInTheDocument();
    expect(screen.getByText("Question 10")).toBeInTheDocument();
    expect(
      screen.getByText("Où se trouve la commande des feux ?")
    ).toBeInTheDocument();
    expect(screen.getByText("Interne")).toBeInTheDocument();
  });

  it("lie le retour vers l'accueil", () => {
    renderWithRouter(<Revision />);

    expect(
      screen.getByRole("link", { name: "Retour à l'accueil" })
    ).toHaveAttribute("href", "/");
  });

  it("révèle une réponse véhicule au clic sur Afficher", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Revision />);

    expect(screen.queryByText("À gauche du volant")).not.toBeInTheDocument();

    const revealButtons = screen.getAllByRole("button", { name: "Afficher" });
    expect(revealButtons).toHaveLength(3);

    await user.click(revealButtons[0]);

    expect(screen.getByText("À gauche du volant")).toBeInTheDocument();
    expect(screen.getByAltText("Illustration")).toHaveAttribute(
      "src",
      "/Img/Q01.png"
    );
    expect(screen.getAllByRole("button", { name: "Afficher" })).toHaveLength(2);
  });

  it("joint les réponses multiples de secours", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Revision />);

    const revealButtons = screen.getAllByRole("button", { name: "Afficher" });
    await user.click(revealButtons[2]);

    expect(screen.getByText((_, element) => {
      return element?.tagName === "PRE" && element.textContent === "15\n112";
    })).toBeInTheDocument();
  });

  it("passe à la question suivante et masque les réponses", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Revision />);

    await user.click(screen.getAllByRole("button", { name: "Afficher" })[0]);
    await user.click(screen.getByRole("button", { name: "Question suivante" }));

    expect(screen.getByText("Question 2 / 2")).toBeInTheDocument();
    expect(screen.getByText("Question 20")).toBeInTheDocument();
    expect(screen.getByText("Comment vérifier les pneus ?")).toBeInTheDocument();
    expect(screen.getByText("Externe")).toBeInTheDocument();
    expect(screen.queryByText("Regarder les témoins")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Afficher" })).toHaveLength(3);
  });

  it("revient à la dernière question depuis la première", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Revision />);

    await user.click(
      screen.getByRole("button", { name: "Question précédente" })
    );

    expect(screen.getByText("Question 2 / 2")).toBeInTheDocument();
    expect(screen.getByText("Question 20")).toBeInTheDocument();
  });

  it("revient à la première question après la dernière", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Revision />);

    await user.click(screen.getByRole("button", { name: "Question suivante" }));
    await user.click(screen.getByRole("button", { name: "Question suivante" }));

    expect(screen.getByText("Question 1 / 2")).toBeInTheDocument();
    expect(screen.getByText("Question 10")).toBeInTheDocument();
  });

  it("ouvre une question aléatoire", async () => {
    const user = userEvent.setup();
    vi.spyOn(Math, "random").mockReturnValue(0.9);
    renderWithRouter(<Revision />);

    await user.click(
      screen.getByRole("button", { name: "Question aléatoire" })
    );

    expect(screen.getByText("Question 2 / 2")).toBeInTheDocument();
    expect(screen.getByText("Question 20")).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
