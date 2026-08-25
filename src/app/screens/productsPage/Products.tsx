import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Pagination } from "@mui/material";
import { ChevronLeftRounded, ChevronRightRounded, FavoriteBorderRounded, SearchRounded, ShoppingBagOutlined, SortRounded } from "@mui/icons-material";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

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
  ProductMemory,
  ProductStatus,
} from "../../../constants/enums";
import { serverApi } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";

const productsRetriever = createSelector(retrieveProducts, (products) => ({ products }));

const categories = Object.values(ProductCategory).map((value) => ({ value, label: PRODUCT_CATEGORY_LABELS[value] }));
const createdAt = new Date().toISOString();

const showcaseProducts: Product[] = [
  { _id: "demo-iphone-17", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.SMARTPHONE, productBrand: ProductBrand.APPLE, productMemory: ProductMemory.GB_256, productName: "iPhone 17 Pro", productPrice: 1199, productLeftCount: 8, productDesc: "A18 Pro chip · 256GB · 5G", productImages: ["/img/iphone 17 pro.jpg"], productViews: 428, createdAt, updatedAt: createdAt },
  { _id: "demo-galaxy", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.SMARTPHONE, productBrand: ProductBrand.SAMSUNG, productMemory: ProductMemory.GB_256, productName: "Samsung Galaxy", productPrice: 999, productLeftCount: 12, productDesc: "AMOLED display · 256GB · AI camera", productImages: ["/img/samsunggalaxy.jpg"], productViews: 362, createdAt, updatedAt: createdAt },
  { _id: "demo-asus", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.LAPTOP, productBrand: ProductBrand.OTHER, productMemory: ProductMemory.TB_1, productName: "ASUS Performance Laptop", productPrice: 1399, productLeftCount: 5, productDesc: "Intel Core · 16GB RAM · 1TB SSD", productImages: ["/img/Asuslaptop.jpg"], productViews: 301, createdAt, updatedAt: createdAt },
  { _id: "demo-macbook", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.LAPTOP, productBrand: ProductBrand.APPLE, productMemory: ProductMemory.GB_512, productName: "MacBook Air", productPrice: 1099, productLeftCount: 7, productDesc: "Apple silicon · 16GB · 512GB SSD", productImages: ["/img/mackboooook.jpg"], productViews: 516, createdAt, updatedAt: createdAt },
  { _id: "demo-headphones", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.AUDIO, productBrand: ProductBrand.SONY, productName: "Studio Wireless Headphones", productPrice: 249, productLeftCount: 18, productDesc: "Noise cancelling · 40-hour battery", productImages: ["/img/headphone.jpg"], productViews: 214, createdAt, updatedAt: createdAt },
  { _id: "demo-airphone", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.AUDIO, productBrand: ProductBrand.APPLE, productName: "True Wireless Earbuds", productPrice: 149, productLeftCount: 24, productDesc: "Spatial audio · Wireless charging", productImages: ["/img/airphone.jpg"], productViews: 187, createdAt, updatedAt: createdAt },
  { _id: "demo-gaming", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.GAMING, productBrand: ProductBrand.OTHER, productName: "Gaming Smart Watch", productPrice: 329, productLeftCount: 9, productDesc: "Performance tracking · GPS · Always-on display", productImages: ["/img/watchhomenavbar.jpg"], productViews: 276, createdAt, updatedAt: createdAt },
  { _id: "demo-camera", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.USED, productCategory: ProductCategory.OTHERS, productBrand: ProductBrand.SONY, productName: "Mirrorless Camera", productPrice: 899, productLeftCount: 4, productDesc: "4K video · Fast autofocus · Wi-Fi", productImages: ["/img/camerabanner.jpg"], productViews: 198, createdAt, updatedAt: createdAt },
];

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
  const { basket: { onAdd } } = useGlobals();
  const dispatch = useDispatch();
  const history = useHistory();
  const { products } = useSelector(productsRetriever);
  const [searchText, setSearchText] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [productSearch, setProductSearch] = useState<ProductInquiry>({ page: 1, limit: 9, order: "createdAt" });
  const reviewsTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    new ProductService().getProducts(productSearch)
      .then((data) => dispatch(setProducts(Array.isArray(data) ? data : [])))
      .catch(() => dispatch(setProducts([])));
  }, [dispatch, productSearch]);

  const sourceProducts = products.length ? products : showcaseProducts;
  const visibleProducts = useMemo(() => sourceProducts.filter((product) => {
    const categoryMatches = !productSearch.productCategory || product.productCategory === productSearch.productCategory;
    const searchMatches = !submittedSearch || `${product.productName} ${product.productDesc || ""}`.toLowerCase().includes(submittedSearch.toLowerCase());
    const conditionMatches = !productSearch.productCondition || product.productCondition === productSearch.productCondition;
    const brandMatches = !productSearch.productBrand || product.productBrand === productSearch.productBrand;
    const priceMatches = priceFilter === "all" || (priceFilter === "under-300" && product.productPrice < 300) || (priceFilter === "300-900" && product.productPrice >= 300 && product.productPrice <= 900) || (priceFilter === "over-900" && product.productPrice > 900);
    return categoryMatches && searchMatches && conditionMatches && brandMatches && priceMatches;
  }), [sourceProducts, productSearch.productCategory, productSearch.productCondition, productSearch.productBrand, submittedSearch, priceFilter]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setSubmittedSearch(searchText.trim());
    setProductSearch((current) => ({ ...current, page: 1, search: searchText.trim() }));
  };

  const selectCategory = (value?: ProductCategory) => {
    setProductSearch((current) => ({ ...current, page: 1, productCategory: value }));
  };

  const addToBasket = (product: Product) => onAdd({ _id: product._id, quantity: 1, name: product.productName, price: product.productPrice, image: product.productImages[0] });
  const scrollReviews = (direction: number) => reviewsTrackRef.current?.scrollBy({ left: direction * 330, behavior: "smooth" });

  return (
    <div className="products">
      <section className="products-hero" aria-labelledby="products-hero-title">
        <div className="products-hero-content">
          <div className="products-hero-copy">
            <span className="products-hero-eyebrow">TECHANOR COLLECTION</span>
            <h1 id="products-hero-title">TECHNOLOGY FOR<br /><em>EVERYDAY MOMENTS.</em></h1>
            <p>Thoughtfully selected devices for work, creativity, entertainment and everyday life.</p>
            <a className="products-hero-cta" href="#product-catalog">Explore Products <span aria-hidden="true">→</span></a>
          </div>
          <div className="products-hero-visual" aria-hidden="true"><img src="/img/products-hero-v2.png" alt="" /></div>
        </div>
      </section>

      <main className="catalog-shell" id="product-catalog">
        <header className="catalog-heading">
          <div><span>OUR COLLECTION</span><h2>All products</h2></div>
          <p>{visibleProducts.length} products found</p>
        </header>

        <div className="catalog-toolbar catalog-toolbar-modern">
          <strong className="catalog-toolbar-label">Filters:</strong>
          <select aria-label="Filter by category" value={productSearch.productCategory || "all"} onChange={(e) => selectCategory(e.target.value === "all" ? undefined : e.target.value as ProductCategory)}>
            <option value="all">Category</option>
            {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
          </select>
          <select aria-label="Filter by condition" value={productSearch.productCondition || "all"} onChange={(e) => setProductSearch((current) => ({ ...current, page: 1, productCondition: e.target.value === "all" ? undefined : e.target.value as ProductCondition }))}>
            <option value="all">Condition</option>{Object.values(ProductCondition).map((value) => <option key={value} value={value}>{PRODUCT_CONDITION_LABELS[value]}</option>)}
          </select>
          <select aria-label="Filter by brand" value={productSearch.productBrand || "all"} onChange={(e) => setProductSearch((current) => ({ ...current, page: 1, productBrand: e.target.value === "all" ? undefined : e.target.value as ProductBrand }))}>
            <option value="all">Brand</option>{Object.values(ProductBrand).map((value) => <option key={value} value={value}>{PRODUCT_BRAND_LABELS[value]}</option>)}
          </select>
          <select aria-label="Filter by price" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
            <option value="all">Price</option><option value="under-300">Under $300</option><option value="300-900">$300 – $900</option><option value="over-900">Over $900</option>
          </select>
          <form className="catalog-search" onSubmit={submitSearch}>
            <SearchRounded /><input type="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search products" aria-label="Search products" />
          </form>
          <label className="catalog-sort"><SortRounded /><select aria-label="Sort products" value={productSearch.order} onChange={(e) => setProductSearch((current) => ({ ...current, page: 1, order: e.target.value }))}><option value="createdAt">Recommended</option><option value="productPrice">Price: low to high</option><option value="productViews">Most viewed</option></select></label>
        </div>

        <div className="catalog-layout catalog-layout-wide">
          <section className="catalog-results" aria-live="polite">
            <div className="catalog-grid">
              {visibleProducts.map((product) => (
                <article className="catalog-card" key={product._id}>
                  <div className="catalog-card-media" onClick={() => !product._id.startsWith("demo-") && history.push(`/products/${product._id}`)}>
                    <button className="catalog-wishlist" type="button" aria-label={`Save ${product.productName}`}><FavoriteBorderRounded /></button>
                    <img src={imageUrl(product.productImages[0])} alt={product.productName} />
                  </div>
                  <div className="catalog-card-body">
                    <h3>{product.productName}</h3>
                    <p>{product.productDesc || "Premium technology selected for everyday performance."}</p>
                    <div className="catalog-card-footer"><div><strong>${product.productPrice.toLocaleString()}</strong><del>${Math.round(product.productPrice * 1.12).toLocaleString()}</del></div><button type="button" onClick={() => addToBasket(product)}><ShoppingBagOutlined /> Add to cart</button></div>
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
