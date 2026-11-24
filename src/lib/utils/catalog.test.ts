import { filterCatalogProducts } from "./catalog";
import { Product } from "../types/product";
import { ProductStatus } from "../../constants/enums";

const base: Product = {
  _id: "available", productName: "Wireless headphones", productPrice: 67,
  productLeftCount: 3, productStatus: ProductStatus.PROCESS,
  productImages: [], productViews: 0, createdAt: "2026-11-24", updatedAt: "2026-11-24",
};
const products = [base, { ...base, _id: "sold-out", productLeftCount: 0 }, { ...base, _id: "free", productPrice: 0 }];
const filters = { search: "", minimumPrice: "", maximumPrice: "", inStockOnly: false };

test("availability filter excludes unavailable records while retaining available products", () => {
  expect(filterCatalogProducts(products, { ...filters, inStockOnly: true }).map((product) => product._id)).toEqual(["available", "free"]);
  expect(filterCatalogProducts(products, filters)).toHaveLength(3);
});

test("zero is a real maximum price rather than an absent limit", () => {
  expect(filterCatalogProducts(products, { ...filters, maximumPrice: "0" }).map((product) => product._id)).toEqual(["free"]);
});

test("price, search and availability work together without changing server records", () => {
  const result = filterCatalogProducts(products, { search: "  HEADPHONES ", minimumPrice: "60", maximumPrice: "70", inStockOnly: true });
  expect(result).toEqual([base]);
  expect(products).toHaveLength(3);
});
