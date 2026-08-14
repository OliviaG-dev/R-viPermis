import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppRoutes } from "./App";
import { renderWithRouter } from "./test/renderWithRouter";

describe("App routing", () => {
  it("affiche la page d'accueil par défaut", () => {
    renderWithRouter(<AppRoutes />);

    expect(
      screen.getByRole("heading", { name: "RéviPermis" })
    ).toBeInTheDocument();
  });

  it("navigue vers le quiz", async () => {
    const user = userEvent.setup();
    renderWithRouter(<AppRoutes />);

    await user.click(screen.getByRole("link", { name: "Quiz" }));

    expect(
      await screen.findByRole("heading", { name: /Quiz du permis/ })
    ).toBeInTheDocument();
  });

  it("navigue vers la révision", async () => {
    const user = userEvent.setup();
    renderWithRouter(<AppRoutes />);

    await user.click(screen.getByRole("link", { name: "Réviser" }));

    expect(
      await screen.findByRole("heading", { name: /Révision du Permis/ })
    ).toBeInTheDocument();
  });

  it("ouvre directement la route /revision", async () => {
    renderWithRouter(<AppRoutes />, { route: "/revision" });

    expect(
      await screen.findByRole("heading", { name: /Révision du Permis/ })
    ).toBeInTheDocument();
  });
});
