import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { showcaseProducts } from "../productsPage/showcaseProducts";

const trendingDeals = [...showcaseProducts]
  .sort((first, second) => second.productViews - first.productViews);

export default function TrendingDeals() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ previous: false, next: true });

  const updateScrollControls = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    setCanScroll({
      previous: carousel.scrollLeft > 4,
      next: carousel.scrollLeft < maxScrollLeft - 4,
    });
  }, []);

  const scrollCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollBy({ left: direction * carousel.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollControls();
    window.addEventListener("resize", updateScrollControls);
    return () => window.removeEventListener("resize", updateScrollControls);
  }, [updateScrollControls]);

  return (
    <section className="trending-deals" aria-labelledby="trending-deals-title">
      <div className="trending-deals__container">
        <header className="trending-deals__heading">
          <h2 id="trending-deals-title">Trending Deals</h2>
          <p>Discover what everyone&apos;s shopping right now.</p>
        </header>

        <div className="trending-deals__carousel">
          <button className="trending-deals__arrow trending-deals__arrow--previous" type="button" onClick={() => scrollCarousel(-1)} disabled={!canScroll.previous} aria-label="Show previous trending products"><ChevronLeftRoundedIcon /></button>
          <div className="trending-deals__grid" ref={carouselRef} onScroll={updateScrollControls}>
            {trendingDeals.map((product) => (
              <article className="trending-card" key={product._id}>
                <h3 title={product.productName}>{product.productName}</h3>
                <Link className="trending-card__media" to="/products" aria-label={`Browse products like ${product.productName}`}>
                  <img src={product.productImages[0]} alt={product.productName} loading="lazy" />
                </Link>
                <Link className="trending-card__buy" to="/products">Browse</Link>
              </article>
            ))}
          </div>
          <button className="trending-deals__arrow trending-deals__arrow--next" type="button" onClick={() => scrollCarousel(1)} disabled={!canScroll.next} aria-label="Show next trending products"><ChevronRightRoundedIcon /></button>
        </div>
      </div>
    </section>
  );
}
