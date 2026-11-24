import { cleanup, render } from "@testing-library/react";
import { act, Simulate } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import NavbarSearch from "./NavbarSearch";

function setup() {
  const history = createMemoryHistory();
  const view = render(<Router history={history}><NavbarSearch variant="inline" /></Router>);
  return { ...view, history };
}

afterEach(cleanup);

test("inline search opens the catalog with the selected category and trimmed query", () => {
  const view = setup();
  const category = view.getByLabelText("Product category") as HTMLSelectElement;
  const input = view.getByLabelText("Search products") as HTMLInputElement;
  act(() => {
    category.value = "SMARTPHONE";
    Simulate.change(category);
  });
  act(() => {
    input.value = "  Samsung  ";
    Simulate.change(input);
  });
  act(() => Simulate.submit(view.container.querySelector("form")!));
  expect(view.history.location.pathname).toBe("/products");
  const params = new URLSearchParams(view.history.location.search);
  expect(params.get("category")).toBe("SMARTPHONE");
  expect(params.get("search")).toBe("Samsung");
});

test("an empty search omits optional filters", () => {
  const view = setup();
  act(() => Simulate.submit(view.container.querySelector("form")!));
  expect(view.history.location.pathname).toBe("/products");
  expect(view.history.location.search).toBe("");
});
