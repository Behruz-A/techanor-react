import { cleanup, render } from "@testing-library/react";
import { act, Simulate } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../store";
import ProductService from "../../services/ProductService";
import { Product } from "../../../lib/types/product";
import { ProductStatus } from "../../../constants/enums";
import Products from "./Products";

const mockAdd = jest.fn();
jest.mock("../../hooks/useGlobals", () => ({ useGlobals: () => ({ basket: { onAdd: mockAdd }, wishlist: { has: () => false, toggle: jest.fn() } }) }));
jest.mock("../../../lib/sweetAlert", () => ({ sweetErrorHandling: jest.fn() }));

const available: Product = {
  _id: "available", productName: "Available headphones", productPrice: 67,
  productLeftCount: 3, productStatus: ProductStatus.PROCESS,
  productImages: [], productViews: 0, createdAt: "2026-11-24", updatedAt: "2026-11-24",
};

beforeEach(() => {
  mockAdd.mockClear();
  jest.spyOn(ProductService.prototype, "getProducts").mockResolvedValue([available, { ...available, _id: "unavailable", productName: "Unavailable headphones", productLeftCount: 0 }]);
});
afterEach(() => { cleanup(); jest.restoreAllMocks(); });

async function setup() {
  let view!: ReturnType<typeof render>;
  await act(async () => { view = render(<Provider store={store}><MemoryRouter><Products /></MemoryRouter></Provider>); });
  return view;
}

test("stock filter updates cards and its removable chip restores the full catalog", async () => {
  const view = await setup();
  expect(view.container.querySelectorAll(".catalog-card")).toHaveLength(2);
  act(() => {
    const input = view.getByLabelText("In stock only") as HTMLInputElement;
    input.checked = true;
    Simulate.change(input);
  });
  expect(view.container.querySelectorAll(".catalog-card")).toHaveLength(1);
  act(() => Simulate.click(view.getByLabelText("Remove In stock only filter")));
  expect(view.container.querySelectorAll(".catalog-card")).toHaveLength(2);
  expect(view.getByLabelText("In stock only")).not.toBeChecked();
});

test("only the available card can add its real product and stock limit to the basket", async () => {
  const view = await setup();
  const soldOut = view.container.querySelector(".catalog-card-footer button:disabled") as HTMLButtonElement | null;
  expect(soldOut).toBeDisabled();
  act(() => Simulate.click(view.getByText("Add to cart")));
  expect(mockAdd).toHaveBeenCalledWith({ _id: available._id, quantity: 1, maxQuantity: 3, name: available.productName, price: 67, image: "" });
});
