import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectHomePage = (state: AppRootState) => state.homePage;

export const retrieveTrendingDeals = createSelector(
  selectHomePage,
  (homePage) => homePage.trendingDeals,
);
