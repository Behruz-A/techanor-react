import { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { A11y, Keyboard, Navigation } from "swiper";
import { replaceBrokenImage, resolveMediaUrl } from "../../../lib/utils/media";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useAppDispatch, useAppSelector } from "../../hooks";
import ProductService from "../../services/ProductService";
import { retrieveTrendingProducts } from "./selector";
import { setTrendingProducts } from "./slice";
import "swiper/css";
import "../../../css/trendingProducts.css";

SwiperCore.use([A11y, Keyboard, Navigation]);

export default function TrendingProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(retrieveTrendingProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    new ProductService().getProducts({ page: 1, limit: 12, order: "productViews" })
      .then((data) => { if (!cancelled) dispatch(setTrendingProducts(data)); })
      .catch((err: unknown) => {
        if (!cancelled) {
          setHasError(true);
          void sweetErrorHandling(err);
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [dispatch, retryKey]);

  const hasProducts = !isLoading && !hasError && products.length > 0;

  return (
    <Box component="section" className="trending-products" aria-labelledby="trending-products-title">
      <div className="trending-products__container">
        <Box component="header" className="trending-products__heading">
          <h2 id="trending-products-title">Trending Products</h2>
          <Stack className="trending-products__controls" aria-label="Trending product carousel controls">
            <button className="trending-products__prev" type="button" aria-label="Previous trending products" aria-controls="trending-products-carousel" disabled={!hasProducts}><ArrowBackRoundedIcon /></button>
            <button className="trending-products__next" type="button" aria-label="Next trending products" aria-controls="trending-products-carousel" disabled={!hasProducts}><ArrowForwardRoundedIcon /></button>
          </Stack>
        </Box>

        {isLoading && <p className="trending-products__state" role="status">Loading trending products...</p>}
        {!isLoading && hasError && <div className="trending-products__state" role="alert"><p>Trending products could not be loaded.</p><button type="button" onClick={() => setRetryKey((value) => value + 1)}>Try again</button></div>}
        {!isLoading && !hasError && products.length === 0 && <p className="trending-products__state">No trending products are available yet.</p>}

        {hasProducts && <Swiper
          id="trending-products-carousel"
          className="trending-products__carousel"
          slidesPerView={1}
          spaceBetween={20}
          watchOverflow
          navigation={{ prevEl: ".trending-products__prev", nextEl: ".trending-products__next" }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          a11y={{ prevSlideMessage: "Previous trending products", nextSlideMessage: "Next trending products" }}
          breakpoints={{
            560: { slidesPerView: 2, spaceBetween: 20 },
            900: { slidesPerView: 3, spaceBetween: 24 },
            1200: { slidesPerView: 4, spaceBetween: 30 },
          }}
        >
          {products.map((product) => <SwiperSlide key={product._id}>
            <Box component="article" className="trending-product">
              <Link className="trending-product__image" to={`/products/${product._id}`} aria-label={`View ${product.productName}`}>
                <img src={resolveMediaUrl(product.productImages[0], "/img/noimage-list.svg")} alt={product.productName} loading="lazy" onError={replaceBrokenImage} />
              </Link>
              <h3 title={product.productName}><Link to={`/products/${product._id}`}>{product.productName}</Link></h3>
              <p className="trending-product__price">${product.productPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </Box>
          </SwiperSlide>)}
        </Swiper>}
      </div>
    </Box>
  );
}
