import React, { useEffect, useState } from "react";
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
import { serverApi } from "../../../lib/config";
import { Product } from "../../../lib/types/product";
import { findShowcaseProduct, showcaseProducts } from "./showcaseProducts";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { isMongoObjectId } from "../../../lib/utils/objectId";
import ShoppingCartIcon from "../../components/icons/ShoppingCartIcon";

const resolveImage = (image?: string) => {
  if (!image) return "";
  return image.startsWith("/") || image.startsWith("http") ? image : `${serverApi}/${image}`;
};

const formatLabel = (value?: string) =>
  value
    ? value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Not specified";

export default function ChosenProduct() {
  const { basket: { onAdd } } = useGlobals();
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const chosenProduct = useAppSelector(retrieveChosenProduct);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"related" | "reviews" | "other">("related");

  useEffect(() => {
    const service = new ProductService();
    const showcaseProduct = findShowcaseProduct(productId);
    dispatch(setChosenProduct(null));
    setIsLoading(true);
    setHasError(false);

    if (showcaseProduct) {
      dispatch(setChosenProduct(showcaseProduct));
      setCatalogProducts(showcaseProducts);
      setIsLoading(false);
      return;
    }
    service
      .getProduct(productId)
      .then((data) => dispatch(setChosenProduct(data)))
      .catch((err) => {
        console.log("Error, chosen product:", err);
        setHasError(true);
      })
      .finally(() => setIsLoading(false));
    service
      .getProducts({ page: 1, limit: 12, order: "createdAt" })
      .then((data) => setCatalogProducts(Array.isArray(data) ? data : []))
      .catch(() => setCatalogProducts([]));
  }, [dispatch, productId]);

  useEffect(() => {
    setQuantity(1);
    setActiveImage(0);
  }, [productId]);

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
  };

  return (
    <main className="techanor-product-detail">
      <section className="product-detail-shell">
        <div className="product-breadcrumb">
          Products <span>/</span> {formatLabel(chosenProduct.productCategory)} <span>/</span>
          <strong>{chosenProduct.productName}</strong>
        </div>

        <div className="product-detail-grid">
          <div className="product-gallery">
            <div className="product-main-image">
              {images[activeImage] ? (
                <img src={resolveImage(images[activeImage])} alt={chosenProduct.productName} />
              ) : (
                <div className="product-image-placeholder">Image unavailable</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="product-thumbnails" aria-label="Product images">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    className={index === activeImage ? "active" : ""}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={resolveImage(image)} alt="" />
                  </button>
                ))}
              </div>
            )}
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
                  <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1 || chosenProduct.productLeftCount <= 0} aria-label="Decrease quantity"><RemoveIcon /></button>
                  <strong>{quantity}</strong>
                  <button onClick={() => setQuantity((value) => Math.min(chosenProduct.productLeftCount, value + 1))} disabled={chosenProduct.productLeftCount <= 0 || quantity >= chosenProduct.productLeftCount} aria-label="Increase quantity"><AddIcon /></button>
                </div>
              </div>
            </div>

            <button className="product-add-button" onClick={addToBasket} disabled={chosenProduct.productLeftCount <= 0 || !isMongoObjectId(chosenProduct._id)}><ShoppingCartIcon /> {!isMongoObjectId(chosenProduct._id) ? "Preview only" : chosenProduct.productLeftCount > 0 ? "Add to cart" : "Out of stock"}</button>
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
          <button className={activeTab === "related" ? "active" : ""} onClick={() => setActiveTab("related")}>Related products</button>
          <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>Customer reviews</button>
          <button className={activeTab === "other" ? "active" : ""} onClick={() => setActiveTab("other")}>Other products</button>
        </div>

        {activeTab === "related" && (
          <div className="related-product-grid">
            {relatedProducts.length ? relatedProducts.map((product: Product) => (
              <article className="related-product-card" key={product._id}>
                <Link to={`/products/${product._id}`} className="related-product-image"><img src={resolveImage(product.productImages?.[0])} alt={product.productName} loading="lazy" /></Link>
                <span>{formatLabel(product.productCategory)}</span>
                <h3>{product.productName}</h3>
                <strong>${product.productPrice.toLocaleString()}</strong>
              </article>
            )) : (
              <div className="product-tab-message"><strong>More products are coming soon.</strong><span>Explore the full collection to discover other Techanor devices.</span></div>
            )}
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="product-tab-message"><strong>No customer reviews yet.</strong><span>Verified reviews will appear here after completed purchases.</span></div>
        )}
        {activeTab === "other" && (
          <div className="related-product-grid">
            {otherProducts.length ? otherProducts.map((product: Product) => (
              <article className="related-product-card" key={product._id}>
                <Link to={`/products/${product._id}`} className="related-product-image"><img src={resolveImage(product.productImages?.[0])} alt={product.productName} loading="lazy" /></Link>
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
