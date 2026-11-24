import TabPanel from "@mui/lab/TabPanel";
import { createSelector } from "reselect";
import { Order } from "../../../lib/types/order";
import { retrieveCancelledOrders } from "./selector";
import { EmptyOrders, OrderCard } from "./OrderCard";
import { useAppSelector } from "../../hooks";

const retriever = createSelector(retrieveCancelledOrders, (cancelledOrders) => ({ cancelledOrders }));

export default function CancelledOrders({ search = "", dateRange = "all" }: { search?: string; dateRange?: string }) {
  const { cancelledOrders } = useAppSelector(retriever);
  const visible = cancelledOrders.filter((order: Order) => {
    const term = search.toLowerCase();
    const matchesSearch = !term || order._id.toLowerCase().includes(term) || order.productData?.some((product) => product.productName.toLowerCase().includes(term));
    const matchesDate = dateRange === "all" || Date.now() - new Date(order.createdAt).getTime() <= Number(dateRange) * 86400000;
    return matchesSearch && matchesDate;
  });
  return <TabPanel value="4" className="orders-tab-panel">{visible.map((order) => <OrderCard key={order._id} order={order} stage={0} status="Cancelled" />)}{visible.length === 0 && <EmptyOrders title="No cancelled orders" text="Cancelled purchases will appear here." />}</TabPanel>;
}
