import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import Home from "./Home";
import { renderWithRouter } from "../../test/renderWithRouter";

describe("Home page", () => {
  it("affiche le titre et le sous-titre", () => {
    renderWithRouter(<Home />);

    expect(
      screen.getByRole("heading", { name: "RéviPermis" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Préparez-vous efficacement pour l'examen du permis de conduire/
      )
    ).toBeInTheDocument();
  });

  it("propose les liens vers la révision et le quiz", () => {
    renderWithRouter(<Home />);

    expect(screen.getByRole("link", { name: "Réviser" })).toHaveAttribute(
      "href",
      "/revision"
    );
    expect(screen.getByRole("link", { name: "Quiz" })).toHaveAttribute(
      "href",
      "/quiz"
    );
  });

  it("présente les trois arguments de la page d'accueil", () => {
    renderWithRouter(<Home />);

    expect(screen.getByRole("heading", { name: "Questions officielles" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "3 types de questions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Organisé par thèmes" })).toBeInTheDocument();
  });
});
