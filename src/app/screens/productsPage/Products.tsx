import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Pagination } from "@mui/material";
import { ChevronLeftRounded, ChevronRightRounded, FavoriteBorderRounded, SearchRounded, SortRounded } from "@mui/icons-material";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import ProductService from "../../services/ProductService";
import { Product, ProductInquiry } from "../../../lib/types/product";
import {
  PRODUCT_BRAND_LABELS,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CONDITION_LABELS,
  ProductBrand,
  ProductCategory,
  ProductCondition,
} from "../../../constants/enums";
import { serverApi } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import { showcaseProducts } from "./showcaseProducts";

const productsRetriever = createSelector(retrieveProducts, (products) => ({ products }));

const categories = Object.values(ProductCategory).map((value) => ({ value, label: PRODUCT_CATEGORY_LABELS[value] }));

const customerReviews = [
  { name: "Daniel K.", rating: "4.8/5", image: "/img/iwatch.jpg", productImage: "/img/iwatch.jpg", product: "Apple Watch · GPS · Cellular", review: "Battery life is impressive and the display is incredibly clear. It has quickly become part of my everyday routine." },
  { name: "Sophia L.", rating: "4.9/5", image: "/img/headphonenew.jpg", productImage: "/img/headphonenew.jpg", product: "Studio Wireless Headphones", review: "The sound is balanced, noise cancelling works extremely well, and the headphones remain comfortable even during long work sessions." },
  { name: "Noah P.", rating: "4.7/5", image: "/img/samsungphone.jpg", productImage: "/img/samsungphone.jpg", product: "Samsung Galaxy · 256GB", review: "The phone looks and feels brand new. The camera is fantastic and the whole buying experience was simple and reliable." },
  { name: "Emma R.", rating: "4.8/5", image: "/img/airphone.jpg", productImage: "/img/airphone.jpg", product: "True Wireless Earbuds", review: "Small, comfortable and surprisingly powerful. They connect instantly and the charging case easily lasts through the week." },
  { name: "James T.", rating: "4.9/5", image: "/img/Asuslaptop.jpg", productImage: "/img/Asuslaptop.jpg", product: "ASUS Performance Laptop · 1TB SSD", review: "A fast and dependable laptop for both work and gaming. The screen is sharp, the keyboard feels great, and it stays quiet under normal use." },
  { name: "Lucas M.", rating: "4.9/5", image: "/img/gamingimg.jpg", productImage: "/img/gamingimg.jpg", product: "Pro Gaming Setup · RGB Edition", review: "The performance is smooth, the setup looks incredible, and every detail feels built for serious gaming. It completely upgraded my desk." },
  { name: "Olivia C.", rating: "4.8/5", image: "/img/cameraimg.jpg", productImage: "/img/cameraimg.jpg", product: "Sony Mirrorless Camera · 4K", review: "Autofocus is incredibly quick and the photos have beautiful detail. It was packed securely and arrived sooner than I expected." },
];

const imageUrl = (path: string) => path.startsWith("/") ? path : `${serverApi}/${path}`;

export default function Products() {
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const addedResetTimer = useRef<number | null>(null);
  const { basket: { onAdd } } = useGlobals();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { products } = useSelector(productsRetriever);
  const [searchText, setSearchText] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const categoryFromUrl = new URLSearchParams(location.search).get("category");
  const initialCategory = Object.values(ProductCategory).includes(categoryFromUrl as ProductCategory)
    ? categoryFromUrl as ProductCategory
    : undefined;
  const [productSearch, setProductSearch] = useState<ProductInquiry>({ page: 1, limit: 9, order: "createdAt", productCategory: initialCategory });
  const reviewsTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => {
    if (addedResetTimer.current !== null) window.clearTimeout(addedResetTimer.current);
  }, []);

  useEffect(() => {
    new ProductService().getProducts(productSearch)
      .then((data) => dispatch(setProducts(Array.isArray(data) ? data : [])))
      .catch(() => dispatch(setProducts([])));
  }, [dispatch, productSearch]);

  useEffect(() => {
    const category = new URLSearchParams(location.search).get("category");
    const validCategory = Object.values(ProductCategory).includes(category as ProductCategory)
      ? category as ProductCategory
      : undefined;
    setProductSearch((current) => current.productCategory === validCategory
      ? current
      : { ...current, page: 1, productCategory: validCategory });
  }, [location.search]);

  const sourceProducts = products.length ? products : showcaseProducts;
  const visibleProducts = useMemo(() => {
    const filteredProducts = sourceProducts.filter((product) => {
      const categoryMatches = !productSearch.productCategory || product.productCategory === productSearch.productCategory;
      const searchMatches = !submittedSearch || `${product.productName} ${product.productDesc || ""}`.toLowerCase().includes(submittedSearch.toLowerCase());
      const conditionMatches = !productSearch.productCondition || product.productCondition === productSearch.productCondition;
      const brandMatches = !productSearch.productBrand || product.productBrand === productSearch.productBrand;
      return categoryMatches && searchMatches && conditionMatches && brandMatches;
    });

    return filteredProducts.sort((first, second) => {
      if (productSearch.order === "productPrice") return first.productPrice - second.productPrice;
      if (productSearch.order === "productViews") return (second.productViews || 0) - (first.productViews || 0);
      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    });
  }, [sourceProducts, productSearch.productCategory, productSearch.productCondition, productSearch.productBrand, productSearch.order, submittedSearch]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setSubmittedSearch(searchText.trim());
    setProductSearch((current) => ({ ...current, page: 1, search: searchText.trim() }));
  };

  const selectCategory = (value?: ProductCategory) => {
    setProductSearch((current) => ({ ...current, page: 1, productCategory: value }));
    history.replace(value ? `/products?category=${value}` : "/products");
  };

  const activeFilterCount = [productSearch.productCategory, productSearch.productCondition, productSearch.productBrand, submittedSearch].filter(Boolean).length;
  const clearFilters = () => {
    setSearchText("");
    setSubmittedSearch("");
    setProductSearch((current) => ({ ...current, page: 1, search: "", productCategory: undefined, productCondition: undefined, productBrand: undefined }));
    history.replace("/products");
  };

  const addToBasket = (product: Product) => {
    onAdd({ _id: product._id, quantity: 1, name: product.productName, price: product.productPrice, image: product.productImages[0] });
    setAddedProductId(product._id);
    if (addedResetTimer.current !== null) window.clearTimeout(addedResetTimer.current);
    addedResetTimer.current = window.setTimeout(() => setAddedProductId(null), 1800);
  };
  const scrollReviews = (direction: number) => reviewsTrackRef.current?.scrollBy({ left: direction * 330, behavior: "smooth" });

  return (
    <div className="products">
      <section className="products-hero products-hero-campaign" aria-labelledby="products-hero-title">
        <div className="products-hero-content">
          <div className="products-hero-copy">
            <h1 id="products-hero-title">Find your<br /><em>next device.</em></h1>
            <p>Discover technology made for everyday life.</p>
            <div className="products-hero-actions">
              <a className="products-hero-cta" href="#product-catalog">Explore products</a>
            </div>
          </div>
          <div className="products-hero-visual" aria-hidden="true"><img src="/img/banner5.png" alt="" /></div>
        </div>
      </section>

      <main className="catalog-shell" id="product-catalog">
        <header className="catalog-heading">
          <div><span>OUR COLLECTION</span><h2>All products</h2></div>
          <p className="catalog-result-count"><strong>{visibleProducts.length}</strong> products found</p>
        </header>

        <div className="catalog-toolbar catalog-toolbar-modern">
          <div className="catalog-filter-heading"><strong className="catalog-toolbar-label">Filters</strong>{activeFilterCount > 0 && <span>{activeFilterCount} active</span>}{activeFilterCount > 0 && <button type="button" onClick={clearFilters}>Clear filters</button>}</div>
          <select className={productSearch.productCategory ? "filter-select active" : "filter-select"} aria-label="Filter by category" value={productSearch.productCategory || "all"} onChange={(e) => selectCategory(e.target.value === "all" ? undefined : e.target.value as ProductCategory)}>
            <option value="all">Category</option>
            {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
          </select>
          <select className={productSearch.productCondition ? "filter-select active" : "filter-select"} aria-label="Filter by condition" value={productSearch.productCondition || "all"} onChange={(e) => setProductSearch((current) => ({ ...current, page: 1, productCondition: e.target.value === "all" ? undefined : e.target.value as ProductCondition }))}>
            <option value="all">Condition</option>{Object.values(ProductCondition).map((value) => <option key={value} value={value}>{PRODUCT_CONDITION_LABELS[value]}</option>)}
          </select>
          <select className={productSearch.productBrand ? "filter-select active" : "filter-select"} aria-label="Filter by brand" value={productSearch.productBrand || "all"} onChange={(e) => setProductSearch((current) => ({ ...current, page: 1, productBrand: e.target.value === "all" ? undefined : e.target.value as ProductBrand }))}>
            <option value="all">Brand</option>{Object.values(ProductBrand).map((value) => <option key={value} value={value}>{PRODUCT_BRAND_LABELS[value]}</option>)}
          </select>
          <select aria-label="Filter by price" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
            <option value="all">Price</option><option value="under-300">Under $300</option><option value="300-900">$300 – $900</option><option value="over-900">Over $900</option>
          </select>
          <form className="catalog-search" onSubmit={submitSearch}>
            <SearchRounded /><input type="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search products" aria-label="Search products" />
          </form>
          <label className="catalog-sort" title="Choose how products are ordered"><SortRounded /><span>Sort by</span><select aria-label="Sort products" value={productSearch.order} onChange={(e) => setProductSearch((current) => ({ ...current, page: 1, order: e.target.value }))}><option value="createdAt">New</option><option value="productPrice">Price</option><option value="productViews">Views</option></select></label>
        </div>

        <div className="catalog-layout catalog-layout-wide">
          <section className="catalog-results" aria-live="polite">
            <div className="catalog-grid">
              {visibleProducts.map((product) => (
                <article className="catalog-card" key={product._id}>
                  <div className="catalog-card-media" onClick={() => history.push(`/products/${product._id}`)}>
                    <button className="catalog-wishlist" type="button" aria-label={`Save ${product.productName}`}><FavoriteBorderRounded /></button>
                    <img src={imageUrl(product.productImages[0])} alt={product.productName} />
                  </div>
                  <div className="catalog-card-body">
                    <h3>{product.productName}</h3>
                    <p>{product.productDesc || "Premium technology selected for everyday performance."}</p>
                    <div className="catalog-card-footer"><div><strong>${product.productPrice.toLocaleString()}</strong><del>${Math.round(product.productPrice * 1.12).toLocaleString()}</del></div><button className={addedProductId === product._id ? "is-added" : ""} type="button" onClick={() => addToBasket(product)} disabled={addedProductId === product._id} aria-live="polite">{addedProductId === product._id ? "Added ✓" : "Add to cart"}</button></div>
                  </div>
                </article>
              ))}
            </div>
            {!visibleProducts.length && <div className="catalog-empty"><h3>No products found</h3><p>Try another category or clear your search.</p></div>}
            {products.length > 0 && <Pagination className="catalog-pagination" count={products.length === productSearch.limit ? productSearch.page + 1 : productSearch.page} page={productSearch.page} onChange={(_: ChangeEvent<unknown>, page) => setProductSearch((current) => ({ ...current, page }))} />}
          </section>
        </div>
      </main>

      <section className="customer-reviews" aria-labelledby="customer-reviews-title">
        <div className="customer-reviews-inner">
          <header className="customer-reviews-header">
            <div><span>REAL EXPERIENCES</span><h2 id="customer-reviews-title">See what our customers say</h2></div>
            <div className="customer-reviews-controls">
              <button type="button" aria-label="Previous reviews" onClick={() => scrollReviews(-1)}><ChevronLeftRounded /></button>
              <button type="button" aria-label="Next reviews" onClick={() => scrollReviews(1)}><ChevronRightRounded /></button>
            </div>
          </header>
          <div className="customer-reviews-track" ref={reviewsTrackRef}>
            {customerReviews.map((item) => (
              <article className="customer-review-card" key={item.name}>
                <div className="customer-review-story">
                  <img src={item.image} alt="" />
                  <span className="customer-review-name">{item.name}</span>
                  <div className="customer-review-copy">
                    <p>{item.review}</p>
                    <strong aria-label={`${item.rating} stars`}><span aria-hidden="true">★★★★★</span> {item.rating}</strong>
                  </div>
                </div>
                <div className="customer-review-product">
                  <img src={item.productImage} alt="" />
                  <span>{item.product}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
