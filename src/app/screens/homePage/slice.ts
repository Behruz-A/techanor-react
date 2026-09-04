import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomePageState } from "../../../lib/types/screen";
import { Product } from "../../../lib/types/product";

const initialState: HomePageState = {
  trendingDeals: [],
  latestCategoryProducts: [],
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setTrendingDeals: (state, action: PayloadAction<Product[]>) => {
      state.trendingDeals = action.payload;
    },
    setLatestCategoryProducts: (state, action: PayloadAction<Product[]>) => {
      state.latestCategoryProducts = action.payload;
    },
  },
});

export const { setTrendingDeals, setLatestCategoryProducts } = homePageSlice.actions;
export default homePageSlice.reducer;
