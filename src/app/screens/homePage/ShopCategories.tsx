import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { PRODUCT_CATEGORY_LABELS, ProductCategory } from "../../../constants/enums";

interface CategoryCard {
  value: ProductCategory;
  image: string;
  tone: string;
  label?: string;
}

const categories: CategoryCard[] = [
  { value: ProductCategory.LAPTOP, image: "/img/mackboooook.jpg", tone: "ice" },
  { value: ProductCategory.SMARTPHONE, image: "/img/iphone17silver.jpg", tone: "lilac" },
  { value: ProductCategory.TV, image: "/img/Samsung TV 50.jpg", tone: "sky" },
  { value: ProductCategory.GAMING, image: "/img/gamingimg.jpg", tone: "slate" },
  { value: ProductCategory.AUDIO, image: "/img/testheadphone.avif", tone: "mist" },
  { value: ProductCategory.CASES, image: "/img/iphone17img3.jpg", tone: "blue", label: "Accessories" },
  { value: ProductCategory.WEARABLES, image: "/img/iwatch.jpg", tone: "wearables" },
  { value: ProductCategory.OTHERS, image: "/img/cameraimg.jpg", tone: "pearl", label: "Cameras" },
];

export default function ShopCategories() {
  return (
    <section id="shop-categories" className="shop-categories" aria-labelledby="categories-title">
      <div className="shop-categories__container">
        <header className="shop-categories__heading">
          <div>
            <span>Find your technology</span>
            <h2 id="categories-title">Shop by Category</h2>
            <p>Everything you need, organized around the way you live.</p>
          </div>
        </header>

        <div className="shop-categories__grid">
          {categories.map((category) => (
            <Link
              className={`category-tile category-tile--${category.tone}`}
              to={`/products?category=${category.value}#product-catalog`}
              key={category.value}
              aria-label={`Shop ${category.label || PRODUCT_CATEGORY_LABELS[category.value]}`}
            >
              <div className="category-tile__media">
                <img
                  src={category.image}
                  alt=""
                  loading="lazy"
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "calc(100% - 48px)",
                    maxHeight: "calc(100% - 48px)",
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                />
              </div>
              <div className="category-tile__copy">
                <h3>{category.label || PRODUCT_CATEGORY_LABELS[category.value]}</h3>
                <span aria-hidden="true"><ArrowForwardRoundedIcon /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
