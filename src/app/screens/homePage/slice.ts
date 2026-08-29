import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomePageState } from "../../../lib/types/screen";
import { Product } from "../../../lib/types/product";

const initialState: HomePageState = {
  trendingDeals: [],
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setTrendingDeals: (state, action: PayloadAction<Product[]>) => {
      state.trendingDeals = action.payload;
    },
  },
});

export const { setTrendingDeals } = homePageSlice.actions;
export default homePageSlice.reducer;
