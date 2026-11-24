import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectHomePage = (state: AppRootState) => state.homePage;

export const retrieveFeaturedProducts = createSelector(
  selectHomePage,
  (homePage) => homePage.featuredProducts,
);

export const retrieveTrendingProducts = createSelector(
  selectHomePage,
  (homePage) => homePage.trendingProducts,
);
