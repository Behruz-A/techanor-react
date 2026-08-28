import { Link } from "react-router-dom";

const releases = [
  { id: "demo-galaxy", brand: "Samsung", name: "Galaxy Z Fold8", tagline: "A new dimension unfolds.", image: "/img/newsamsungphone.jpg", theme: "fold" },
  { id: "demo-macbook-pro", brand: "Apple", name: "MacBook Pro", tagline: "Power at the speed of ideas.", image: "/img/newmackbook.jpg", theme: "mac" },
  { id: "demo-premium-headphones", brand: "Premium Audio", name: "Spatial Headphones", tagline: "Quiet never sounded this good.", image: "/img/newsonyimg.png", theme: "audio" },
  { id: "demo-lg-oled", brand: "LG", name: "OLED evo G6", tagline: "Every colour comes alive.", image: "/img/newgoled.jpg", theme: "oled" },
];

export default function NewReleases() {
  return (
    <section className="new-releases new-releases--showcase" aria-labelledby="new-releases-title">
      <div className="new-releases__container">
        <header className="new-releases__heading">
          <div><span>Four brands · Just landed</span><h2 id="new-releases-title">New Releases</h2></div>
          <Link to="/products">View all products <span aria-hidden="true">→</span></Link>
        </header>

        <div className="release-showcase">
          {releases.map((product) => (
            <article className={`release-showcase__item release-showcase__item--${product.theme}`} key={product.id}>
              <div className="release-showcase__copy">
                <span>{product.brand}</span>
                <h3>{product.name}</h3>
                <p>{product.tagline}</p>
                <div className="release-showcase__actions">
                  <Link to="/products">Learn more</Link>
                  <Link to="/products" className="release-showcase__buy">Buy</Link>
                </div>
              </div>
              <Link className="release-showcase__media" to="/products" aria-label={`Browse products like ${product.name}`}>
                <img src={product.image} alt="" loading="lazy" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
