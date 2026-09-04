import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Pagination } from "@mui/material";
import { CloseRounded, Favorite, FavoriteBorderRounded, SearchRounded, SortRounded, TuneRounded } from "@mui/icons-material";
import { createSelector } from "reselect";
import { Link, useHistory, useLocation } from "react-router-dom";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import ProductService from "../../services/ProductService";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { PRODUCT_BRAND_LABELS, PRODUCT_CATEGORY_LABELS, PRODUCT_CONDITION_LABELS, PRODUCT_MEMORY_LABELS, ProductBrand, ProductCategory, ProductCondition, ProductMemory } from "../../../constants/enums";
import { useGlobals } from "../../hooks/useGlobals";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { replaceBrokenImage, resolveMediaUrl } from "../../../lib/utils/media";

const productsRetriever = createSelector(retrieveProducts, (products) => ({ products }));
const categories = Object.values(ProductCategory).map((value) => ({ value, label: PRODUCT_CATEGORY_LABELS[value] }));
const PAGE_SIZE = 9;
const CATALOG_BATCH_SIZE = 50;
const MAX_CATALOG_PAGES = 20;
export default function Products() {
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const addedResetTimer = useRef<number | null>(null);
  const { basket: { onAdd }, wishlist } = useGlobals();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();
  const { products } = useAppSelector(productsRetriever);
  const initialParams = new URLSearchParams(location.search);
  const searchFromUrl = initialParams.get("search") || "";
  const categoryFromUrl = initialParams.get("category");
  const initialCategory = Object.values(ProductCategory).includes(categoryFromUrl as ProductCategory) ? categoryFromUrl as ProductCategory : undefined;
  const [searchText, setSearchText] = useState(searchFromUrl);
  const [submittedSearch, setSubmittedSearch] = useState(searchFromUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
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
        const batch = await productService.getProducts({ page, limit: CATALOG_BATCH_SIZE, order: "createdAt", productCategory: productSearch.productCategory, productCondition: productSearch.productCondition, productBrand: productSearch.productBrand, productMemory: productSearch.productMemory, search: productSearch.search });
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
  }, [dispatch, productSearch.productCategory, productSearch.productCondition, productSearch.productBrand, productSearch.productMemory, productSearch.search, retryKey]);

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
    const minimum = Number(minimumPrice) || 0;
    const maximum = Number(maximumPrice) || Number.POSITIVE_INFINITY;
    const filteredProducts = products.filter((product) => {
      const searchMatches = !normalizedSearch || `${product.productName} ${product.productDesc || ""}`.toLowerCase().includes(normalizedSearch);
      return searchMatches && product.productPrice >= minimum && product.productPrice <= maximum;
    });
    return [...filteredProducts].sort((first, second) => {
      if (productSearch.order === "priceAscending") return first.productPrice - second.productPrice;
      if (productSearch.order === "priceDescending") return second.productPrice - first.productPrice;
      if (productSearch.order === "productViews") return (second.productViews || 0) - (first.productViews || 0);
      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    });
  }, [products, productSearch.order, submittedSearch, minimumPrice, maximumPrice]);

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
  const activeFilterCount = [productSearch.productCategory, productSearch.productCondition, productSearch.productBrand, productSearch.productMemory, submittedSearch, minimumPrice, maximumPrice].filter(Boolean).length;
  const clearFilters = () => { setSearchText(""); setSubmittedSearch(""); setMinimumPrice(""); setMaximumPrice(""); setProductSearch((current) => ({ ...current, page: 1, search: "", productCategory: undefined, productCondition: undefined, productBrand: undefined, productMemory: undefined })); history.replace("/products"); };
  const addToBasket = (product: Product) => { onAdd({ _id: product._id, quantity: 1, maxQuantity: product.productLeftCount, name: product.productName, price: product.productPrice, image: product.productImages?.[0] || "" }); setAddedProductId(product._id); if (addedResetTimer.current !== null) window.clearTimeout(addedResetTimer.current); addedResetTimer.current = window.setTimeout(() => setAddedProductId(null), 1800); };
  const openProduct = (productId: string) => history.push(`/products/${productId}`);

  return <div className="products">
    <main className="catalog-shell" id="product-catalog">
      <nav className="shop-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>›</span><strong>Shop</strong>{productSearch.productCategory && <><span>›</span><b>{PRODUCT_CATEGORY_LABELS[productSearch.productCategory]}</b></>}</nav>
      <header className="catalog-heading"><h1>{productSearch.productCategory ? PRODUCT_CATEGORY_LABELS[productSearch.productCategory] : "All Products"}</h1><p className="catalog-result-count"><strong>{isLoading ? "—" : visibleProducts.length}</strong> products</p></header>
      <div className="catalog-toolbar catalog-toolbar-modern">
        <div className="catalog-toolbar-primary">
          <form className="catalog-search" onSubmit={submitSearch}><button type="submit" aria-label="Search products"><SearchRounded /></button><input type="search" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search products..." aria-label="Search products" /></form>
          {activeFilterCount > 0 && <button className="catalog-clear-filters" type="button" onClick={clearFilters}>Clear ({activeFilterCount})</button>}
        </div>
        <div className="catalog-toolbar-secondary"><button className="catalog-mobile-filter-button" type="button" onClick={() => setFiltersOpen(true)}><TuneRounded />Filters{activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button><label className="catalog-sort" title="Choose how products are ordered"><SortRounded /><span>Sort by</span><select aria-label="Sort products" value={productSearch.order} onChange={(event) => setProductSearch((current) => ({ ...current, page: 1, order: event.target.value }))}><option value="createdAt">Newest</option><option value="priceAscending">Price: low to high</option><option value="priceDescending">Price: high to low</option><option value="productViews">Most viewed</option></select></label></div>
      </div>
      <div className="catalog-layout catalog-layout-wide">
        {filtersOpen && <button className="catalog-filter-backdrop" type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />}
        <aside className={`catalog-filter-panel${filtersOpen ? " is-open" : ""}`} aria-label="Product filters">
          <div className="catalog-filter-panel-title"><strong>Filters</strong><div>{activeFilterCount > 0 && <button type="button" onClick={clearFilters}>Clear all</button>}<button className="catalog-filter-close" type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><CloseRounded /></button></div></div>
          <section className="catalog-filter-section"><h2>Price</h2><div className="catalog-price-fields"><label><span>From</span><div>$<input type="number" min="0" value={minimumPrice} onChange={(event) => setMinimumPrice(event.target.value)} placeholder="0"/></div></label><label><span>To</span><div>$<input type="number" min="0" value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)} placeholder="Any"/></div></label></div></section>
          <FilterGroup title="Category" values={categories} active={productSearch.productCategory} onSelect={(value) => selectCategory(value as ProductCategory | undefined)} />
          <FilterGroup title="Brand" values={Object.values(ProductBrand).map((value) => ({ value, label: PRODUCT_BRAND_LABELS[value] }))} active={productSearch.productBrand} onSelect={(value) => setProductSearch((current) => ({ ...current, page: 1, productBrand: value as ProductBrand | undefined }))} />
          <FilterGroup title="Built-in memory" collapsible values={Object.values(ProductMemory).map((value) => ({ value, label: PRODUCT_MEMORY_LABELS[value] }))} active={productSearch.productMemory} onSelect={(value) => setProductSearch((current) => ({ ...current, page: 1, productMemory: value as ProductMemory | undefined }))} />
          <FilterGroup title="Condition" collapsible values={Object.values(ProductCondition).map((value) => ({ value, label: PRODUCT_CONDITION_LABELS[value] }))} active={productSearch.productCondition} onSelect={(value) => setProductSearch((current) => ({ ...current, page: 1, productCondition: value as ProductCondition | undefined }))} />
        </aside>
        <section className="catalog-results" aria-live="polite">
        {!isLoading && !hasError && <div className="catalog-grid">{paginatedProducts.map((product) => <article className="catalog-card" key={product._id}>
          <div className="catalog-card-media" role="link" tabIndex={0} aria-label={`View ${product.productName}`} onClick={() => openProduct(product._id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openProduct(product._id); } }}>
            <button className={wishlist.has(product._id) ? "catalog-wishlist active" : "catalog-wishlist"} type="button" aria-label={`${wishlist.has(product._id) ? "Remove" : "Save"} ${product.productName}`} onClick={(event) => { event.stopPropagation(); wishlist.toggle(product); }}>{wishlist.has(product._id) ? <Favorite /> : <FavoriteBorderRounded />}</button>
            {product.productImages?.[0] ? <img src={resolveMediaUrl(product.productImages[0])} alt={product.productName} loading="lazy" onError={replaceBrokenImage} /> : <span className="catalog-image-placeholder">Image unavailable</span>}
          </div>
          <div className="catalog-card-body">{product.productCategory && <span className="catalog-card-category">{PRODUCT_CATEGORY_LABELS[product.productCategory]}</span>}<h3>{product.productName}</h3><p>{product.productDesc || "Premium technology selected for everyday performance."}</p><div className="catalog-card-footer"><div><strong>${product.productPrice.toLocaleString()}</strong></div><button className={addedProductId === product._id ? "is-added" : ""} type="button" onClick={() => addToBasket(product)} disabled={addedProductId === product._id || product.productLeftCount <= 0} aria-live="polite">{product.productLeftCount <= 0 ? "Out of stock" : addedProductId === product._id ? "Added ✓" : "Add to cart"}</button></div></div>
        </article>)}</div>}
        {isLoading && <div className="catalog-status" role="status"><span className="catalog-loader" /><h3>Loading products</h3><p>Preparing the latest Techanor collection.</p></div>}
        {!isLoading && hasError && <div className="catalog-status"><h3>Products are temporarily unavailable</h3><p>Please check the connection and try again.</p><button type="button" onClick={() => setRetryKey((value) => value + 1)}>Try again</button></div>}
        {!isLoading && !hasError && !visibleProducts.length && <div className="catalog-empty"><h3>No products found</h3><p>Try another category or clear your search.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>}
        {!isLoading && !hasError && visibleProducts.length > PAGE_SIZE && <Pagination className="catalog-pagination" count={pageCount} page={productSearch.page} onChange={(_: ChangeEvent<unknown>, page) => { setProductSearch((current) => ({ ...current, page })); document.getElementById("product-catalog")?.scrollIntoView({ behavior: "smooth" }); }} />}
        </section>
      </div>
    </main>
  </div>;
}

interface FilterGroupProps { title: string; values: Array<{ value: string; label: string }>; active?: string; collapsible?: boolean; onSelect: (value?: string) => void; }
function FilterGroup({ title, values, active, collapsible = false, onSelect }: FilterGroupProps) {
  const [expanded, setExpanded] = useState(!collapsible || Boolean(active));
  return <section className={`catalog-filter-section${collapsible ? " is-collapsible" : ""}`}><button className="catalog-filter-section-heading" type="button" onClick={() => collapsible && setExpanded((value) => !value)} aria-expanded={expanded}><h2>{title}</h2>{collapsible && <span>{expanded ? "−" : "+"}</span>}</button>{expanded && <div className="catalog-filter-options"><button type="button" className={!active ? "active" : ""} onClick={() => onSelect(undefined)}><i/>All</button>{values.map(({ value, label }) => <button type="button" className={active === value ? "active" : ""} key={value} onClick={() => onSelect(active === value ? undefined : value)}><i/>{label}</button>)}</div>}</section>;
}
