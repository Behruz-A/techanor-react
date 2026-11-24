import { cleanup, render } from "@testing-library/react";
import { act, Simulate } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import { ProductCategory, ProductCondition, ProductStatus } from "../../../constants/enums";
import FeaturedProductCard from "./FeaturedProductCard";

const mockOnAdd = jest.fn();
let mockCartItems: CartItem[] = [];

jest.mock("../../hooks/useGlobals", () => ({
  useGlobals: () => ({
    wishlist: { has: () => false, toggle: jest.fn() },
    basket: { cartItems: mockCartItems, onAdd: mockOnAdd },
  }),
}));
jest.mock("../../../lib/sweetAlert", () => ({
  sweetErrorHandling: jest.fn(), sweetTopSmallSuccessAlert: jest.fn(),
}));

const product: Product = {
  _id: "6a99bc047f9c674e33f04570", productName: "Test headphones",
  productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW,
  productCategory: ProductCategory.AUDIO, productPrice: 120, productLeftCount: 3,
  productImages: ["/uploads/first.jpg", "/uploads/second.jpg"], productViews: 10,
  createdAt: "2026-11-24T09:00:00.000Z", updatedAt: "2026-11-24T09:00:00.000Z",
};

function setup(input = product) {
  return render(<MemoryRouter><FeaturedProductCard product={input} /></MemoryRouter>);
}

beforeEach(() => { mockOnAdd.mockClear(); mockCartItems = []; });
afterEach(cleanup);

test("adds the actual product to the existing basket with its stock limit", () => {
  const view = setup();
  act(() => Simulate.click(view.getByLabelText("Add Test headphones to cart")));
  expect(mockOnAdd).toHaveBeenCalledWith({
    _id: product._id, name: product.productName, price: product.productPrice,
    quantity: 1, maxQuantity: 3, image: product.productImages[0],
  });
});

test("out-of-stock products cannot be added", () => {
  const view = setup({ ...product, productLeftCount: 0 });
  const button = view.getByText("Out of stock").closest("button")!;
  expect(button).toBeDisabled();
  act(() => Simulate.click(button));
  expect(mockOnAdd).not.toHaveBeenCalled();
});

test("a basket at the available stock limit cannot add more", () => {
  mockCartItems = [{ _id: product._id, name: product.productName, price: 120, quantity: 3, maxQuantity: 3, image: "" }];
  const view = setup();
  expect(view.getByText("Maximum in cart").closest("button")).toBeDisabled();
});

test("gallery controls change the image without navigating to the product", () => {
  const view = setup();
  act(() => Simulate.click(view.getByLabelText("Next image of Test headphones")));
  expect(view.getByAltText("Test headphones").getAttribute("src")).toContain("second.jpg");
  act(() => Simulate.click(view.getByLabelText("Previous image of Test headphones")));
  expect(view.getByAltText("Test headphones").getAttribute("src")).toContain("first.jpg");
});
