import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

export const renderWithRouter = (
  ui: ReactElement,
  options?: { route?: string }
) => {
  const route = options?.route ?? "/";

  return render(
    <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
  );
};
