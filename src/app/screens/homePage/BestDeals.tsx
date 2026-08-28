import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

const deals = [
  {
    id: "deal-iphone-17-pro",
    name: "iPhone 17 Pro Max",
    image: "/img/iphone-17-pro.jpg",
    oldPrice: 1499,
    price: 1279,
    left: 23,
    accent: "peach",
  },
  {
    id: "deal-wireless-headphones",
    name: "Premium Wireless Headphones",
    image: "/img/testheadphone.avif",
    oldPrice: 399,
    price: 279,
    left: 12,
    accent: "lavender",
  },
  {
    id: "deal-smart-watch",
    name: "Apple Watch Series 9",
    image: "/img/iwatch.jpg",
    oldPrice: 529,
    price: 429,
    left: 8,
    accent: "lemon",
  },
];

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

        <div className="best-deals__grid">
          {deals.map((deal) => {
            const isFavorite = favorites.includes(deal.id);
            const discount = Math.round((1 - deal.price / deal.oldPrice) * 100);
            return (
              <article className={`deal-card deal-card--${deal.accent}`} key={deal.id}>
                <button
                  className={`deal-card__favorite${isFavorite ? " is-active" : ""}`}
                  onClick={() => toggleFavorite(deal.id)}
                  aria-label={isFavorite ? `Remove ${deal.name} from favorites` : `Add ${deal.name} to favorites`}
                  type="button"
                >
                  {isFavorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                </button>
                <span className="deal-card__discount">-{discount}%</span>
                <div className="deal-card__image-wrap">
                  <img src={deal.image} alt={deal.name} loading="lazy" />
                </div>
                <div className="deal-card__content">
                  <h3>{deal.name}</h3>
                  <div className="deal-card__price">
                    <del>${deal.oldPrice.toLocaleString()}</del>
                    <strong>${deal.price.toLocaleString()}</strong>
                  </div>
                  <div className="deal-card__footer">
                    <span>Available: <strong>{deal.left} products</strong></span>
                    <Link className="deal-card__shop" to="/products">Shop deal</Link>
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
