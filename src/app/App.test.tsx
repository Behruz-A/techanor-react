import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Footer from "./components/footer";

test("renders the Techanor footer navigation", () => {
  // Testing Library v9 uses the legacy ReactDOM API and logs a React 18 warning.
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );

  expect(screen.getByText("Techanor", { selector: ".footer-brand" })).toBeInTheDocument();
  expect(screen.getByText(/Back to top/i, { selector: "button" })).toBeInTheDocument();
  consoleError.mockRestore();
});
