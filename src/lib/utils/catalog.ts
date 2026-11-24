import { Product } from "../types/product";

interface CatalogFilters {
  search: string;
  minimumPrice: string;
  maximumPrice: string;
  inStockOnly: boolean;
}

export function filterCatalogProducts(products: Product[], filters: CatalogFilters): Product[] {
  const search = filters.search.trim().toLowerCase();
  const minimum = filters.minimumPrice.trim() === "" ? 0 : Number(filters.minimumPrice);
  const maximum = filters.maximumPrice.trim() === "" ? Infinity : Number(filters.maximumPrice);
  return products.filter((product) => {
    const matchesSearch = !search || `${product.productName} ${product.productDesc || ""}`.toLowerCase().includes(search);
    return matchesSearch && product.productPrice >= minimum && product.productPrice <= maximum
      && (!filters.inStockOnly || product.productLeftCount > 0);
  });
}
