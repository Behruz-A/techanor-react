import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../../../lib/types/order";
import { OrdersPageState } from "../../../lib/types/screen";

const initialState: OrdersPageState = {
  pausedOrders: [],
  processOrders: [],
  finishedOrders: [],
  cancelledOrders: [],
};

const ordersPageSlice = createSlice({
  name: "ordersPage",
  initialState,
  reducers: {
    setPausedOrders: (state, action: PayloadAction<Order[]>) => {
      state.pausedOrders = action.payload;
    },
    setProcessOrders: (state, action: PayloadAction<Order[]>) => {
      state.processOrders = action.payload;
    },
    setFinishedOrders: (state, action: PayloadAction<Order[]>) => {
      state.finishedOrders = action.payload;
    },
    setCancelledOrders: (state, action: PayloadAction<Order[]>) => {
      state.cancelledOrders = action.payload;
    },
  },
});

export const { setPausedOrders, setProcessOrders, setFinishedOrders, setCancelledOrders } =
  ordersPageSlice.actions;

const OrdersPageReducer = ordersPageSlice.reducer;
export default OrdersPageReducer;
