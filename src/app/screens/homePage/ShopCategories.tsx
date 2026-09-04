import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { PRODUCT_CATEGORY_LABELS, ProductCategory } from "../../../constants/enums";
import { replaceBrokenImage, resolveMediaUrl } from "../../../lib/utils/media";
import { useAppDispatch, useAppSelector } from "../../hooks";
import ProductService from "../../services/ProductService";
import { retrieveLatestCategoryProducts } from "./selector";
import { setLatestCategoryProducts } from "./slice";

interface CategoryCard {
  value: ProductCategory;
  fallbackImage: string;
  label?: string;
}

const categories: CategoryCard[] = [
  { value: ProductCategory.LAPTOP, fallbackImage: "/img/newmackbook.jpg" },
  { value: ProductCategory.SMARTPHONE, fallbackImage: "/img/iphone17silver.jpg" },
  { value: ProductCategory.TV, fallbackImage: "/img/newgoled.jpg" },
  { value: ProductCategory.GAMING, fallbackImage: "/img/gamingimg.jpg" },
  { value: ProductCategory.AUDIO, fallbackImage: "/img/headphonenew.jpg" },
  { value: ProductCategory.CASES, fallbackImage: "/img/iphone17img3.jpg", label: "Accessories" },
  { value: ProductCategory.WEARABLES, fallbackImage: "/img/watchnew.png" },
  { value: ProductCategory.OTHERS, fallbackImage: "/img/cameraimg.jpg", label: "Others" },
];

export default function ShopCategories() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(retrieveLatestCategoryProducts);

  useEffect(() => {
    let isCancelled = false;
    new ProductService().getProducts({ order: "createdAt", page: 1, limit: 50 })
      .then((data) => { if (!isCancelled) dispatch(setLatestCategoryProducts(Array.isArray(data) ? data : [])); })
      .catch(() => { if (!isCancelled) dispatch(setLatestCategoryProducts([])); });
    return () => { isCancelled = true; };
  }, [dispatch]);

  const latestByCategory = useMemo(() => {
    const result = new Map<ProductCategory, string>();
    products.forEach((product) => {
      if (product.productCategory && !result.has(product.productCategory) && product.productImages?.[0]) {
        result.set(product.productCategory, product.productImages[0]);
      }
    });
    return result;
  }, [products]);

  return (
    <section id="shop-categories" className="shop-categories" aria-labelledby="categories-title">
      <div className="shop-categories__container">
        <header className="shop-categories__heading"><div><span>Find your technology</span><h2 id="categories-title">Shop by Category</h2><p>Explore the newest products in every category.</p></div></header>
        <div className="shop-categories__grid">
          {categories.map((category, index) => {
            const label = category.label || PRODUCT_CATEGORY_LABELS[category.value];
            const image = resolveMediaUrl(latestByCategory.get(category.value), category.fallbackImage);
            return <Link className={`category-tile category-tile--tone-${(index % 4) + 1}`} to={`/products?category=${category.value}#product-catalog`} key={category.value} aria-label={`Shop ${label}`}>
              <div className="category-tile__media">
                <small>{String(index + 1).padStart(2, "0")}</small>
                <img src={image} alt={`Newest ${label.toLowerCase()} product`} loading="lazy" onError={(event) => replaceBrokenImage(event, category.fallbackImage)}/>
              </div>
              <div className="category-tile__copy">
                <div><h3>{label}</h3><p>Explore collection</p></div>
                <span aria-hidden="true"><ArrowForwardRoundedIcon/></span>
              </div>
            </Link>;
          })}
        </div>
      </div>
    </section>
  );
}
