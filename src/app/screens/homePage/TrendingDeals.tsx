import { Link } from "react-router-dom";

const trendingDeals = [
  { id: "demo-macbook", name: "Premium Laptop", image: "/img/mackboooook.jpg" },
  { id: "demo-galaxy", name: "Smartphone Pro", image: "/img/samsunggalaxy.jpg" },
  { id: "demo-headphones", name: "Wireless Headphones", image: "/img/testheadphone.avif" },
  { id: "demo-gaming", name: "Smart Watch", image: "/img/watchhomenavbar.jpg" },
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
              <Link className="trending-card__media" to={`/products/${product.id}`}>
                <img src={product.image} alt={product.name} loading="lazy" />
              </Link>
              <Link className="trending-card__buy" to={`/products/${product.id}`}>Buy</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
