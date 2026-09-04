import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ProductService from "../../services/ProductService";
import { Product } from "../../../lib/types/product";
import { replaceBrokenImage, resolveMediaUrl } from "../../../lib/utils/media";
import { useGlobals } from "../../hooks/useGlobals";

const cardAccents = ["peach", "lavender", "lemon"];
const initialSeconds = 2 * 24 * 60 * 60 + 11 * 60 * 60 + 39 * 60 + 57;

function DealTimer() {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : initialSeconds));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const units = [
    { value: Math.floor(secondsLeft / 86400), label: "Days" },
    { value: Math.floor((secondsLeft % 86400) / 3600), label: "Hours" },
    { value: Math.floor((secondsLeft % 3600) / 60), label: "Mins" },
    { value: secondsLeft % 60, label: "Secs" },
  ];

  return (
    <div className="best-deals__countdown" aria-label="Time remaining until the offer ends">
      <span className="best-deals__countdown-label">Hurry! Offer ends in</span>
      {units.map((unit, index) => (
        <div className="best-deals__time-group" key={unit.label}>
          {index > 0 && <span className="best-deals__time-separator">:</span>}
          <span className="best-deals__time-box">
            <strong>{String(unit.value).padStart(2, "0")}</strong>
            <small>{unit.label}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BestDeals() {
  const { wishlist } = useGlobals();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const productService = new ProductService();
    let isCancelled = false;
    setIsLoading(true);
    setHasError(false);

    productService.getBestSellers(3)
      .then((data) => {
        if (!isCancelled) setProducts(data);
      })
      .catch(() => {
        if (!isCancelled) setHasError(true);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [retryKey]);

  const deals = useMemo(() => {
    return products
      .filter((product) => product.productImages?.length > 0)
      .slice(0, 3);
  }, [products]);

  return (
    <section className="best-deals" aria-labelledby="best-deals-title">
      <div className="best-deals__container">
        <header className="best-deals__header">
          <div>
            <span className="best-deals__eyebrow">Limited-time offers</span>
            <h2 id="best-deals-title">Today&apos;s Best Deals</h2>
            <p>Save big on your favorite tech while stocks last.</p>
          </div>
          <DealTimer />
        </header>

        <div className="best-deals__grid" aria-live="polite">
          {isLoading && <p className="best-deals__status">Loading today&apos;s best deals...</p>}
          {!isLoading && hasError && (
            <div className="best-deals__status">
              <span>Today&apos;s deals are temporarily unavailable.</span>
              <button type="button" onClick={() => setRetryKey((value) => value + 1)}>Try again</button>
            </div>
          )}
          {!isLoading && !hasError && deals.length === 0 && <p className="best-deals__status">No in-stock deals are available right now.</p>}
          {!isLoading && !hasError && deals.map((deal, index) => {
            const isFavorite = wishlist.has(deal._id);
            return (
              <article className={`deal-card deal-card--${cardAccents[index]}`} key={deal._id}>
                <button
                  className={`deal-card__favorite${isFavorite ? " is-active" : ""}`}
                  onClick={() => wishlist.toggle(deal)}
                  aria-label={isFavorite ? `Remove ${deal.productName} from favorites` : `Add ${deal.productName} to favorites`}
                  type="button"
                >
                  {isFavorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                </button>
                <div className="deal-card__image-wrap">
                  <img src={resolveMediaUrl(deal.productImages[0], "/img/noimage-list.svg")} alt={deal.productName} loading="lazy" onError={replaceBrokenImage} />
                </div>
                <div className="deal-card__content">
                  <h3>{deal.productName}</h3>
                  <div className="deal-card__price">
                    <strong>${deal.productPrice.toLocaleString()}</strong>
                  </div>
                  <div className="deal-card__footer">
                    <span>{deal.productLeftCount > 0 ? <>Only <strong>{deal.productLeftCount} left</strong></> : <strong>Sold out</strong>}</span>
                    <Link className="deal-card__shop" to={`/products/${deal._id}`}>{deal.productLeftCount > 0 ? "Shop deal" : "View product"}</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
