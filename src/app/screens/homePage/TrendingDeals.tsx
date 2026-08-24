import { Link } from "react-router-dom";

const trendingDeals = [
  { id: "laptop", name: "Premium Laptop", image: "/img/mackboooook.jpg" },
  { id: "smartphone", name: "Smartphone Pro", image: "/img/samsunggalaxy.jpg" },
  { id: "headphones", name: "Wireless Headphones", image: "/img/testheadphone.avif" },
  { id: "smart-device", name: "Smart Watch", image: "/img/watchhomenavbar.jpg" },
];

export default function TrendingDeals() {
  return (
    <section className="trending-deals" aria-labelledby="trending-deals-title">
      <div className="trending-deals__container">
        <header className="trending-deals__heading">
          <h2 id="trending-deals-title">Trending Deals</h2>
          <p>Discover what everyone&apos;s shopping right now.</p>
        </header>

        <div className="trending-deals__grid">
          {trendingDeals.map((product) => (
            <article className="trending-card" key={product.id}>
              <h3>{product.name}</h3>
              <div className="trending-card__media">
                <img src={product.image} alt={product.name} loading="lazy" />
              </div>
              <Link className="trending-card__buy" to="/products">Buy</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
