import TrendingDeals from "./TrendingDeals";
import BlackFridayPromo from "./BlackFridayPromo";
import NewReleases from "./NewReleases";
import VideoShowcase from "./VideoShowcase";
import Events from "./Events";
import MediaSpotlight from "./MediaSpotlight";
import BestDeals from "./BestDeals";
import ShopCategories from "./ShopCategories";
import "../../../css/home.css";

export default function HomePage() {
  return (
    <main className="homepage">
      <BestDeals />
      <ShopCategories />
      <TrendingDeals />
      <BlackFridayPromo />
      <NewReleases />
      <VideoShowcase />
      <Events />
      <MediaSpotlight />
    </main>
  );
}
