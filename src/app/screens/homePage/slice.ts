import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomePageState } from "../../../lib/types/screen";
import { Product } from "../../../lib/types/product";

const initialState: HomePageState = {
  featuredProducts: [],
  trendingProducts: [],
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
    },
    setTrendingProducts: (state, action: PayloadAction<Product[]>) => {
      state.trendingProducts = action.payload;
    },
  },
});

export const { setFeaturedProducts, setTrendingProducts } = homePageSlice.actions;
export default homePageSlice.reducer;
