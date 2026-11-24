import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Footer from "./components/footer";

test("renders the Techanor footer navigation", () => {
  // Testing Library v9 uses the legacy ReactDOM API and logs a React 18 warning.
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
  const { getByLabelText, getByText } = render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );

  expect(getByLabelText("Techanor home", { selector: ".footer-brand" })).toBeInTheDocument();
  expect(getByText("Customer Service")).toBeInTheDocument();
  consoleError.mockRestore();
});
