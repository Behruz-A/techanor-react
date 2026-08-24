import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Laptops", image: "/img/mackboooook.jpg", tone: "ice" },
  { name: "Smartphones", image: "/img/samsunggalaxy.jpg", tone: "lilac" },
  { name: "Audio", image: "/img/testheadphone.avif", tone: "sky" },
  { name: "Gaming", image: "/img/image2.jpg", tone: "slate" },
  { name: "Cameras", image: "/img/camerabanner.jpg", tone: "mist" },
  { name: "Wearables", image: "/img/watchhomenavbar.jpg", tone: "blue" },
];

export default function ShopCategories() {
  return (
    <section id="shop-categories" className="shop-categories" aria-labelledby="categories-title">
      <div className="shop-categories__container">
        <header className="shop-categories__heading">
          <div>
            <span>Find your technology</span>
            <h2 id="categories-title">Shop by Category</h2>
          </div>
          <p>Everything you need, organized around the way you live.</p>
        </header>

        <div className="shop-categories__grid">
          {categories.map((category) => (
            <Link
              className={`category-tile category-tile--${category.tone}`}
              to={`/products?category=${category.name.toLowerCase()}`}
              key={category.name}
            >
              <div className="category-tile__media">
                <img src={category.image} alt="" loading="lazy" />
              </div>
              <div className="category-tile__copy">
                <h3>{category.name}</h3>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
