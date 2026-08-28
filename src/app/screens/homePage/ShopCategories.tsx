import { Link } from "react-router-dom";
import { ProductCategory } from "../../../constants/enums";

const categories = [
  { name: "Laptops", value: ProductCategory.LAPTOP, image: "/img/mackboooook.jpg", tone: "ice" },
  { name: "Smartphones", value: ProductCategory.SMARTPHONE, image: "/img/iphone17silver.jpg", tone: "lilac" },
  { name: "TV", value: ProductCategory.TV, image: "/img/Samsung TV 50.jpg", tone: "sky" },
  { name: "Gaming", value: ProductCategory.GAMING, image: "/img/gamingimg.jpg", tone: "slate" },
  { name: "Audio", value: ProductCategory.AUDIO, image: "/img/testheadphone.avif", tone: "mist" },
  { name: "Cases", value: ProductCategory.CASES, image: "/img/iphone17img3.jpg", tone: "blue" },
  { name: "Wearables", value: ProductCategory.WEARABLES, image: "/img/iwatch.jpg", tone: "wearables" },
  { name: "Others", value: ProductCategory.OTHERS, image: "/img/cameraimg.jpg", tone: "pearl" },
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
              to={`/products?category=${category.value}#product-catalog`}
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
