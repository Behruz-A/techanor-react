import { createSelector } from "reselect";
import { RootState } from "../../store";

const selectOrdersPage = (state: RootState) => state.ordersPage;

export const retrievePausedOrders = createSelector(
  selectOrdersPage,
  (OrdersPage) => OrdersPage.pausedOrders,
);

export const retrieveProcessOrders = createSelector(
  selectOrdersPage,
  (OrdersPage) => OrdersPage.processOrders,
);

export const retrieveFinishedOrders = createSelector(
  selectOrdersPage,
  (OrdersPage) => OrdersPage.finishedOrders,
);

export const retrieveCancelledOrders = createSelector(
  selectOrdersPage,
  (OrdersPage) => OrdersPage.cancelledOrders,
);
