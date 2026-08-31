import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ProductService from "../../services/ProductService";
import { serverApi } from "../../../lib/config";
import { Product } from "../../../lib/types/product";

const cardAccents = ["peach", "lavender", "lemon"];
const dealPresentation = [
  { name: "Roborock Robot Vacuum", image: "/img/img.jpg", oldPrice: 899, price: 739, discount: 18, stock: 12 },
  { name: "LG UltraGear OLED Monitor", image: "/img/tvimg.jpg", oldPrice: 999, price: 749, discount: 25, stock: 8 },
  { name: "Wireless Gaming Controller", image: "/img/controllergamigimg.png", oldPrice: 79, price: 67, discount: 15, stock: 21 },
];

const resolveProductImage = (image?: string) => {
  if (!image) return "/img/noimage-list.svg";
  return image.startsWith("/") || image.startsWith("http") ? image : `${serverApi}/${image}`;
};

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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const productService = new ProductService();
    let isCancelled = false;
    setIsLoading(true);
    setHasError(false);

    productService.getProducts({ page: 1, limit: 12, order: "productViews" })
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
    const available = products.filter((product) => product.productLeftCount > 0 && product.productImages?.length > 0);
    const selected: Product[] = [];
    const selectedCategories = new Set<string>();

    available.forEach((product) => {
      const category = product.productCategory || "uncategorized";
      if (selected.length < 3 && !selectedCategories.has(category)) {
        selected.push(product);
        selectedCategories.add(category);
      }
    });

    available.forEach((product) => {
      if (selected.length < 3 && !selected.some((item) => item._id === product._id)) selected.push(product);
    });

    return selected;
  }, [products]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

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
            const presentation = dealPresentation[index];
            const isFavorite = favorites.includes(deal._id);
            return (
              <article className={`deal-card deal-card--${cardAccents[index]} deal-card--product-${index + 1}`} key={deal._id}>
                <button
                  className={`deal-card__favorite${isFavorite ? " is-active" : ""}`}
                  onClick={() => toggleFavorite(deal._id)}
                  aria-label={isFavorite ? `Remove ${presentation.name} from favorites` : `Add ${presentation.name} to favorites`}
                  type="button"
                >
                  {isFavorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                </button>
                <span className="deal-card__discount">-{presentation.discount}%</span>
                <div className="deal-card__image-wrap">
                  <img src={presentation.image || resolveProductImage(deal.productImages[0])} alt={presentation.name} loading="lazy" />
                </div>
                <div className="deal-card__content">
                  <h3>{presentation.name}</h3>
                  <div className="deal-card__price">
                    <del>${presentation.oldPrice.toLocaleString()}</del>
                    <strong>${presentation.price.toLocaleString()}</strong>
                  </div>
                  <div className="deal-card__footer">
                    <span>Only <strong>{presentation.stock} left</strong></span>
                    <Link className="deal-card__shop" to={`/products/${deal._id}`}>Shop deal</Link>
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
