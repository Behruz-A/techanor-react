import TrendingDeals from "./TrendingDeals";
import NewReleases from "./NewReleases";
import VideoShowcase from "./VideoShowcase";
import Events from "./Events";
import BestDeals from "./BestDeals";
import ShopCategories from "./ShopCategories";
import "../../../css/home.css";

export default function HomePage() {
  return (
    <main className="homepage">
      <ShopCategories />
      <NewReleases />
      <TrendingDeals />
      <BestDeals />
      <VideoShowcase />
      <Events />
    </main>
  );
}
