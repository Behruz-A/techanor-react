import React from "react";
import { Link } from "react-router-dom";

const releases = [
  {
    id: "galaxy-fold",
    name: "Galaxy Z Fold",
    price: "$1,299",
    image: "/img/samsunggalaxy.jpg",
    badge: "New",
    views: 248,
  },
  {
    id: "headphones",
    name: "Studio Headphones",
    price: "$349",
    image: "/img/testheadphone.avif",
    badge: "New",
    views: 186,
  },
  {
    id: "macbook-air",
    name: "MacBook Air",
    price: "$999",
    image: "/img/mackboooook.jpg",
    badge: "New",
    views: 321,
  },
  {
    id: "iphone-pro",
    name: "iPhone Pro",
    price: "$1,099",
    image: "/img/iphonebanner.jpg",
    badge: "New",
    views: 275,
  },
];

export default function NewReleases() {
  return (
    <section className="new-releases" aria-labelledby="new-releases-title">
      <div className="new-releases__container">
        <header className="new-releases__heading">
          <div>
            <span>Just landed</span>
            <h2 id="new-releases-title">New Releases</h2>
          </div>
          <Link to="/products">View all products <span aria-hidden="true">→</span></Link>
        </header>

        <div className="new-releases__grid">
          {releases.map((product) => (
            <Link className="release-card" to="/products" key={product.id}>
              <div className="release-card__media">
                <span className="release-card__badge">{product.badge}</span>
                <img src={product.image} alt={product.name} loading="lazy" />
              </div>
              <div className="release-card__details">
                <h3>{product.name}</h3>
                <div className="release-card__meta">
                  <strong>{product.price}</strong>
                  <span className="release-card__views" aria-label={`${product.views} views`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2.4 12s3.5-6 9.6-6 9.6 6 9.6 6-3.5 6-9.6 6-9.6-6-9.6-6Z" />
                      <circle cx="12" cy="12" r="2.7" />
                    </svg>
                    {product.views}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
