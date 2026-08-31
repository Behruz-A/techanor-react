import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Pagination } from "@mui/material";
import { Favorite, FavoriteBorderRounded, SearchRounded, SortRounded } from "@mui/icons-material";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import ProductService from "../../services/ProductService";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { PRODUCT_BRAND_LABELS, PRODUCT_CATEGORY_LABELS, PRODUCT_CONDITION_LABELS, ProductBrand, ProductCategory, ProductCondition } from "../../../constants/enums";
import { serverApi } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";

const productsRetriever = createSelector(retrieveProducts, (products) => ({ products }));
const categories = Object.values(ProductCategory).map((value) => ({ value, label: PRODUCT_CATEGORY_LABELS[value] }));
const PAGE_SIZE = 9;
const CATALOG_BATCH_SIZE = 50;
const MAX_CATALOG_PAGES = 20;
const imageUrl = (path?: string) => !path ? "" : path.startsWith("/") || path.startsWith("http") ? path : `${serverApi}/${path}`;
const imageScaleClass = (product: Product) => {
  const name = product.productName.toLowerCase();
  if (name.includes("rolex") || name.includes("watch")) return "catalog-card-media--small-product";
  if (name.includes("airphone") || name.includes("earphone") || name.includes("headphone")) return "catalog-card-media--large-product";
  return "";
};

export default function Products() {
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const addedResetTimer = useRef<number | null>(null);
  const { basket: { onAdd }, wishlist } = useGlobals();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { products } = useSelector(productsRetriever);
  const initialParams = new URLSearchParams(location.search);
  const searchFromUrl = initialParams.get("search") || "";
  const categoryFromUrl = initialParams.get("category");
  const initialCategory = Object.values(ProductCategory).includes(categoryFromUrl as ProductCategory) ? categoryFromUrl as ProductCategory : undefined;
  const [searchText, setSearchText] = useState(searchFromUrl);
  const [submittedSearch, setSubmittedSearch] = useState(searchFromUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({ page: 1, limit: PAGE_SIZE, order: "createdAt", productCategory: initialCategory, search: searchFromUrl });

  useEffect(() => () => { if (addedResetTimer.current !== null) window.clearTimeout(addedResetTimer.current); }, []);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setHasError(false);
    const productService = new ProductService();
    const loadCatalog = async () => {
      const catalog: Product[] = [];
      for (let page = 1; page <= MAX_CATALOG_PAGES; page += 1) {
        const batch = await productService.getProducts({ page, limit: CATALOG_BATCH_SIZE, order: "createdAt", productCategory: productSearch.productCategory, productCondition: productSearch.productCondition, productBrand: productSearch.productBrand, search: productSearch.search });
        catalog.push(...batch);
        if (batch.length < CATALOG_BATCH_SIZE) break;
      }
      return catalog;
    };
    loadCatalog()
      .then((data) => { if (!isCancelled) dispatch(setProducts(Array.isArray(data) ? data : [])); })
      .catch(() => { if (!isCancelled) { dispatch(setProducts([])); setHasError(true); } })
      .finally(() => { if (!isCancelled) setIsLoading(false); });
    return () => { isCancelled = true; };
  }, [dispatch, productSearch.productCategory, productSearch.productCondition, productSearch.productBrand, productSearch.search, retryKey]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const search = params.get("search") || "";
    const validCategory = Object.values(ProductCategory).includes(category as ProductCategory) ? category as ProductCategory : undefined;
    setSearchText(search);
    setSubmittedSearch(search);
    setProductSearch((current) => ({ ...current, page: 1, productCategory: validCategory, search }));
  }, [location.search]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = submittedSearch.toLowerCase();
    const filteredProducts = products.filter((product) => {
      const searchMatches = !normalizedSearch || `${product.productName} ${product.productDesc || ""}`.toLowerCase().includes(normalizedSearch);
      return searchMatches;
    });
    return [...filteredProducts].sort((first, second) => {
      if (productSearch.order === "priceAscending") return first.productPrice - second.productPrice;
      if (productSearch.order === "priceDescending") return second.productPrice - first.productPrice;
      if (productSearch.order === "productViews") return (second.productViews || 0) - (first.productViews || 0);
      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    });
  }, [products, productSearch.order, submittedSearch]);

  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
  const paginatedProducts = visibleProducts.slice((productSearch.page - 1) * PAGE_SIZE, productSearch.page * PAGE_SIZE);
  useEffect(() => { if (productSearch.page > pageCount) setProductSearch((current) => ({ ...current, page: pageCount })); }, [pageCount, productSearch.page]);

  const syncCatalogUrl = (category?: ProductCategory, search = submittedSearch) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    history.replace(params.toString() ? `/products?${params.toString()}` : "/products");
  };
  const submitSearch = (event: FormEvent) => { event.preventDefault(); const search = searchText.trim(); setSubmittedSearch(search); setProductSearch((current) => ({ ...current, page: 1, search })); syncCatalogUrl(productSearch.productCategory, search); };
  const selectCategory = (value?: ProductCategory) => { setProductSearch((current) => ({ ...current, page: 1, productCategory: value })); syncCatalogUrl(value); };
  const activeFilterCount = [productSearch.productCategory, productSearch.productCondition, productSearch.productBrand, submittedSearch].filter(Boolean).length;
  const clearFilters = () => { setSearchText(""); setSubmittedSearch(""); setProductSearch((current) => ({ ...current, page: 1, search: "", productCategory: undefined, productCondition: undefined, productBrand: undefined })); history.replace("/products"); };
  const addToBasket = (product: Product) => { onAdd({ _id: product._id, quantity: 1, maxQuantity: product.productLeftCount, name: product.productName, price: product.productPrice, image: product.productImages?.[0] || "" }); setAddedProductId(product._id); if (addedResetTimer.current !== null) window.clearTimeout(addedResetTimer.current); addedResetTimer.current = window.setTimeout(() => setAddedProductId(null), 1800); };
  const openProduct = (productId: string) => history.push(`/products/${productId}`);

  return <div className="products">
    <section className="products-hero products-hero-campaign" aria-labelledby="products-hero-title"><div className="products-hero-content"><div className="products-hero-copy"><span className="products-page-eyebrow">TECHANOR COLLECTION</span><h1 id="products-hero-title">Technology, carefully selected.</h1><p>Explore devices and accessories chosen for work, creativity and everyday life.</p><nav className="products-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>›</span><strong>Products</strong></nav></div></div></section>
    <main className="catalog-shell" id="product-catalog">
      <header className="catalog-heading"><h2>All Products</h2><p className="catalog-result-count"><strong>{isLoading ? "—" : visibleProducts.length}</strong> products</p></header>
      <div className="catalog-toolbar catalog-toolbar-modern">
        <div className="catalog-toolbar-primary">
          <form className="catalog-search" onSubmit={submitSearch}><button type="submit" aria-label="Search products"><SearchRounded /></button><input type="search" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search products..." aria-label="Search products" /></form>
          <select className={productSearch.productCategory ? "filter-select active" : "filter-select"} aria-label="Filter by category" value={productSearch.productCategory || "all"} onChange={(event) => selectCategory(event.target.value === "all" ? undefined : event.target.value as ProductCategory)}><option value="all">Category</option>{categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}</select>
          <select className={productSearch.productBrand ? "filter-select active" : "filter-select"} aria-label="Filter by brand" value={productSearch.productBrand || "all"} onChange={(event) => setProductSearch((current) => ({ ...current, page: 1, productBrand: event.target.value === "all" ? undefined : event.target.value as ProductBrand }))}><option value="all">Brand</option>{Object.values(ProductBrand).map((value) => <option key={value} value={value}>{PRODUCT_BRAND_LABELS[value]}</option>)}</select>
          <select className={productSearch.productCondition ? "filter-select active" : "filter-select"} aria-label="Filter by condition" value={productSearch.productCondition || "all"} onChange={(event) => setProductSearch((current) => ({ ...current, page: 1, productCondition: event.target.value === "all" ? undefined : event.target.value as ProductCondition }))}><option value="all">Condition</option>{Object.values(ProductCondition).map((value) => <option key={value} value={value}>{PRODUCT_CONDITION_LABELS[value]}</option>)}</select>
          {activeFilterCount > 0 && <button className="catalog-clear-filters" type="button" onClick={clearFilters}>Clear ({activeFilterCount})</button>}
        </div>
        <div className="catalog-toolbar-secondary"><label className="catalog-sort" title="Choose how products are ordered"><SortRounded /><span>Sort by</span><select aria-label="Sort products" value={productSearch.order} onChange={(event) => setProductSearch((current) => ({ ...current, page: 1, order: event.target.value }))}><option value="createdAt">Newest</option><option value="priceAscending">Price: low to high</option><option value="priceDescending">Price: high to low</option><option value="productViews">Most viewed</option></select></label></div>
      </div>
      <div className="catalog-layout catalog-layout-wide"><section className="catalog-results" aria-live="polite">
        {!isLoading && !hasError && <div className="catalog-grid">{paginatedProducts.map((product) => <article className="catalog-card" key={product._id}>
          <div className={`catalog-card-media ${imageScaleClass(product)}`} role="link" tabIndex={0} aria-label={`View ${product.productName}`} onClick={() => openProduct(product._id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openProduct(product._id); } }}>
            <button className={wishlist.has(product._id) ? "catalog-wishlist active" : "catalog-wishlist"} type="button" aria-label={`${wishlist.has(product._id) ? "Remove" : "Save"} ${product.productName}`} onClick={(event) => { event.stopPropagation(); wishlist.toggle(product); }}>{wishlist.has(product._id) ? <Favorite /> : <FavoriteBorderRounded />}</button>
            {imageUrl(product.productImages?.[0]) ? <img src={imageUrl(product.productImages[0])} alt={product.productName} loading="lazy" /> : <span className="catalog-image-placeholder">Image unavailable</span>}
          </div>
          <div className="catalog-card-body"><h3>{product.productName}</h3><p>{product.productDesc || "Premium technology selected for everyday performance."}</p><div className="catalog-card-footer"><div><strong>${product.productPrice.toLocaleString()}</strong></div><button className={addedProductId === product._id ? "is-added" : ""} type="button" onClick={() => addToBasket(product)} disabled={addedProductId === product._id || product.productLeftCount <= 0} aria-live="polite">{product.productLeftCount <= 0 ? "Out of stock" : addedProductId === product._id ? "Added ✓" : "Add to cart"}</button></div></div>
        </article>)}</div>}
        {isLoading && <div className="catalog-status" role="status"><span className="catalog-loader" /><h3>Loading products</h3><p>Preparing the latest Techanor collection.</p></div>}
        {!isLoading && hasError && <div className="catalog-status"><h3>Products are temporarily unavailable</h3><p>Please check the connection and try again.</p><button type="button" onClick={() => setRetryKey((value) => value + 1)}>Try again</button></div>}
        {!isLoading && !hasError && !visibleProducts.length && <div className="catalog-empty"><h3>No products found</h3><p>Try another category or clear your search.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>}
        {!isLoading && !hasError && visibleProducts.length > PAGE_SIZE && <Pagination className="catalog-pagination" count={pageCount} page={productSearch.page} onChange={(_: ChangeEvent<unknown>, page) => { setProductSearch((current) => ({ ...current, page })); document.getElementById("product-catalog")?.scrollIntoView({ behavior: "smooth" }); }} />}
      </section></div>
    </main>
  </div>;
}
