import FeaturedProducts from "./FeaturedProducts";
import ProductShowcase from "./ProductShowcase";
import Events from "./Events";
import TrendingProducts from "./TrendingProducts";
import CollectionBanners from "./CollectionBanners";
import "../../../css/home.css";

export default function HomePage() {
  return (
    <main className="homepage">
      <CollectionBanners />
      <FeaturedProducts />
      <TrendingProducts />
      <ProductShowcase />
      <Events />
    </main>
  );
}
