import TrendingDeals from "./TrendingDeals";
import BlackFridayPromo from "./BlackFridayPromo";
import NewReleases from "./NewReleases";
import VideoShowcase from "./VideoShowcase";
import Events from "./Events";
import MediaSpotlight from "./MediaSpotlight";
import OfficialPartners from "./OfficialPartners";
import ShopCategories from "./ShopCategories";
import "../../../css/home.css";

export default function HomePage() {
  return (
    <main className="homepage">
      <OfficialPartners />
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
