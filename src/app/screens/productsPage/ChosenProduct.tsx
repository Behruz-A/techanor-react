import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import { useGlobals } from "../../hooks/useGlobals";
import { setChosenProduct } from "./slice";
import { retrieveChosenProduct } from "./selector";
import ProductService from "../../services/ProductService";
import { Product } from "../../../lib/types/product";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { isMongoObjectId } from "../../../lib/utils/objectId";
import { replaceBrokenImage, resolveMediaUrl } from "../../../lib/utils/media";
import ShoppingCartIcon from "../../components/icons/ShoppingCartIcon";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

const formatLabel = (value?: string) =>
  value
    ? value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Not specified";

export default function ChosenProduct() {
  const { basket: { onAdd }, wishlist } = useGlobals();
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const chosenProduct = useAppSelector(retrieveChosenProduct);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"related" | "other">("related");
  const [isAdded, setIsAdded] = useState(false);
  const addedResetTimer = useRef<number | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const service = new ProductService();
    dispatch(setChosenProduct(null));
    setIsLoading(true);
    setHasError(false);

    service
      .getProduct(productId)
      .then((data) => { if (!isCancelled) dispatch(setChosenProduct(data)); })
      .catch(() => {
        if (!isCancelled) setHasError(true);
      })
      .finally(() => { if (!isCancelled) setIsLoading(false); });
    service
      .getProducts({ page: 1, limit: 12, order: "createdAt" })
      .then((data) => { if (!isCancelled) setCatalogProducts(Array.isArray(data) ? data : []); })
      .catch(() => { if (!isCancelled) setCatalogProducts([]); });
    return () => { isCancelled = true; };
  }, [dispatch, productId]);

  useEffect(() => {
    setQuantity(1);
    setActiveImage(0);
    setIsAdded(false);
    if (addedResetTimer.current !== null) window.clearTimeout(addedResetTimer.current);
  }, [productId]);

  useEffect(() => () => {
    if (addedResetTimer.current !== null) window.clearTimeout(addedResetTimer.current);
  }, []);

  if (isLoading) {
    return <main className="product-detail-status">Loading product...</main>;
  }

  if (hasError || !chosenProduct) {
    return (
      <main className="product-detail-status">
        <h1>Product unavailable</h1>
        <p>This product could not be loaded or no longer exists.</p>
        <Link to="/products">Back to products</Link>
      </main>
    );
  }

  const sourceImages = chosenProduct.productImages?.length ? chosenProduct.productImages : [""];
  const images = sourceImages;
  const relatedProducts = catalogProducts
    .filter((product) => product._id !== chosenProduct._id && product.productCategory === chosenProduct.productCategory)
    .slice(0, 4);
  const otherProducts = catalogProducts
    .filter((product) => product._id !== chosenProduct._id && product.productCategory !== chosenProduct.productCategory)
    .slice(0, 4);
  const addToBasket = () => {
    if (!isMongoObjectId(chosenProduct._id)) return;
    onAdd({
      _id: chosenProduct._id,
      quantity,
      maxQuantity: chosenProduct.productLeftCount,
      name: chosenProduct.productName,
      price: chosenProduct.productPrice,
      image: chosenProduct.productImages?.[0] || "",
    });
    setIsAdded(true);
    if (addedResetTimer.current !== null) window.clearTimeout(addedResetTimer.current);
    addedResetTimer.current = window.setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <main className="techanor-product-detail">
      <section className="product-detail-shell">
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          <Link to="/products">Products</Link> <span>/</span> {formatLabel(chosenProduct.productCategory)} <span>/</span>
          <strong>{chosenProduct.productName}</strong>
        </nav>

        <div className="product-detail-grid">
          <div className="product-gallery">
            <div className="product-main-image">
              {images[activeImage] ? (
                <img src={resolveMediaUrl(images[activeImage])} alt={chosenProduct.productName} onError={replaceBrokenImage} />
              ) : (
                <div className="product-image-placeholder">Image unavailable</div>
              )}
            </div>
            <div className="product-thumbnails" aria-label="Product images">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    className={index === activeImage ? "active" : ""}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    {image ? <img src={resolveMediaUrl(image)} alt="" onError={replaceBrokenImage} /> : <span>Image unavailable</span>}
                  </button>
                ))}
            </div>
          </div>

          <div className="product-detail-copy">
            <span className="product-category-label">{formatLabel(chosenProduct.productCategory)}</span>
            <h1>{chosenProduct.productName}</h1>
            <div className="product-detail-meta">
              <RemoveRedEyeOutlinedIcon /><span>{chosenProduct.productViews || 0} views</span>
            </div>

            <p className="product-detail-description">
              {chosenProduct.productDesc || "A thoughtfully selected device designed for dependable everyday performance, work and entertainment."}
            </p>

            <dl className="product-quick-specs">
              <div><dt>Brand</dt><dd>{formatLabel(chosenProduct.productBrand)}</dd></div>
              <div><dt>Condition</dt><dd>{formatLabel(chosenProduct.productCondition)}</dd></div>
              {chosenProduct.productMemory && <div><dt>Storage</dt><dd>{chosenProduct.productMemory}</dd></div>}
              {chosenProduct.productScreenSize && <div><dt>Screen</dt><dd>{chosenProduct.productScreenSize}&quot;</dd></div>}
            </dl>

            <div className="product-purchase-row">
              <div className="product-price-block"><span>Price</span><strong>${chosenProduct.productPrice.toLocaleString()}</strong></div>
              <div className="product-quantity-block">
                <span>Quantity</span>
                <div className="quantity-control">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1 || chosenProduct.productLeftCount <= 0} aria-label="Decrease quantity"><RemoveIcon /></button>
                  <strong>{quantity}</strong>
                  <button type="button" onClick={() => setQuantity((value) => Math.min(chosenProduct.productLeftCount, value + 1))} disabled={chosenProduct.productLeftCount <= 0 || quantity >= chosenProduct.productLeftCount} aria-label="Increase quantity"><AddIcon /></button>
                </div>
              </div>
            </div>

            <div className="product-action-row">
              <button className={`product-wishlist-button${wishlist.has(chosenProduct._id) ? " active" : ""}`} type="button" onClick={() => wishlist.toggle(chosenProduct)} aria-label={`${wishlist.has(chosenProduct._id) ? "Remove" : "Add"} ${chosenProduct.productName} ${wishlist.has(chosenProduct._id) ? "from" : "to"} wishlist`}>{wishlist.has(chosenProduct._id) ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}<span>{wishlist.has(chosenProduct._id) ? "Saved" : "Add to wishlist"}</span></button>
              <button className={`product-add-button${isAdded ? " is-added" : ""}`} type="button" onClick={addToBasket} disabled={isAdded || chosenProduct.productLeftCount <= 0 || !isMongoObjectId(chosenProduct._id)} aria-live="polite"><ShoppingCartIcon /> {!isMongoObjectId(chosenProduct._id) ? "Preview only" : chosenProduct.productLeftCount <= 0 ? "Out of stock" : isAdded ? "Added ✓" : "Add to cart"}</button>
            </div>
            <p className="product-stock-note">
              {chosenProduct.productLeftCount > 0 ? `${chosenProduct.productLeftCount} items available` : "Currently out of stock"}
            </p>
            <div className="product-trust-row">
              <span><LocalShippingOutlinedIcon /> Fast delivery</span>
              <span><VerifiedUserOutlinedIcon /> Secure checkout</span>
              <span><ReplayOutlinedIcon /> Easy returns</span>
            </div>
          </div>
        </div>
      </section>

      <section className="product-detail-lower">
        <div className="product-detail-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={activeTab === "related"} className={activeTab === "related" ? "active" : ""} onClick={() => setActiveTab("related")}>Related products</button>
          <button type="button" role="tab" aria-selected={activeTab === "other"} className={activeTab === "other" ? "active" : ""} onClick={() => setActiveTab("other")}>Other products</button>
        </div>

        {activeTab === "related" && (
          <div className="related-product-grid">
            {relatedProducts.length ? relatedProducts.map((product: Product) => (
              <article className="related-product-card" key={product._id}>
                <Link to={`/products/${product._id}`} className="related-product-image"><img src={resolveMediaUrl(product.productImages?.[0], "/img/noimage-list.svg")} alt={product.productName} loading="lazy" onError={replaceBrokenImage} /></Link>
                <span>{formatLabel(product.productCategory)}</span>
                <h3>{product.productName}</h3>
                <strong>${product.productPrice.toLocaleString()}</strong>
              </article>
            )) : (
              <div className="product-tab-message"><strong>More products are coming soon.</strong><span>Explore the full collection to discover other Techanor devices.</span></div>
            )}
          </div>
        )}
        {activeTab === "other" && (
          <div className="related-product-grid">
            {otherProducts.length ? otherProducts.map((product: Product) => (
              <article className="related-product-card" key={product._id}>
                <Link to={`/products/${product._id}`} className="related-product-image"><img src={resolveMediaUrl(product.productImages?.[0], "/img/noimage-list.svg")} alt={product.productName} loading="lazy" onError={replaceBrokenImage} /></Link>
                <span>{formatLabel(product.productCategory)}</span>
                <h3>{product.productName}</h3>
                <strong>${product.productPrice.toLocaleString()}</strong>
              </article>
            )) : <div className="product-tab-message"><strong>Explore the collection.</strong><span>Other product recommendations will appear here.</span></div>}
          </div>
        )}
      </section>
    </main>
  );
}
