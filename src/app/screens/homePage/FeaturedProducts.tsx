import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useAppDispatch, useAppSelector } from "../../hooks";
import ProductService from "../../services/ProductService";
import { retrieveFeaturedProducts } from "./selector";
import { setFeaturedProducts } from "./slice";
import FeaturedProductCard from "./FeaturedProductCard";

export default function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(retrieveFeaturedProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    new ProductService().getProducts({ page: 1, limit: 8, order: "productViews" })
      .then((data) => { if (!cancelled) dispatch(setFeaturedProducts(data)); })
      .catch((err: unknown) => {
        if (!cancelled) {
          setHasError(true);
          void sweetErrorHandling(err);
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [dispatch, retryKey]);

  return (
    <Box component="section" className="featured-products" aria-labelledby="featured-products-title">
      <div className="featured-products__container">
        <h2 id="featured-products-title">Featured products</h2>
        {isLoading && <p className="featured-products__state" role="status">Loading featured products...</p>}
        {!isLoading && hasError && <div className="featured-products__state" role="alert"><p>Featured products could not be loaded.</p><button type="button" onClick={() => setRetryKey((value) => value + 1)}>Try again</button></div>}
        {!isLoading && !hasError && products.length === 0 && <p className="featured-products__state">No featured products are available yet.</p>}
        {!isLoading && !hasError && <Box className="featured-products__grid">
          {products.map((product) => <FeaturedProductCard product={product} key={product._id} />)}
        </Box>}
      </div>
    </Box>
  );
}
