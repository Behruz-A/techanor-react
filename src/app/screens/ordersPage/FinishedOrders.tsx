import TabPanel from "@mui/lab/TabPanel";
import { useAppSelector } from "../../hooks";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { Order } from "../../../lib/types/order";
import { EmptyOrders, OrderCard } from "./OrderCard";

const retriever = createSelector(retrieveFinishedOrders, (finishedOrders) => ({ finishedOrders }));
export default function FinishedOrders({ search = "", dateRange = "all" }: { search?: string; dateRange?: string }) { const { finishedOrders } = useAppSelector(retriever); const visible = finishedOrders?.filter((order: Order) => { const term = search.toLowerCase(); const matchesSearch = !term || order._id.toLowerCase().includes(term) || order.productData?.some((product) => product.productName.toLowerCase().includes(term)); const matchesDate = dateRange === "all" || Date.now() - new Date(order.createdAt).getTime() <= Number(dateRange) * 86400000; return matchesSearch && matchesDate; }); return <TabPanel value="3" className="orders-tab-panel">{visible?.map((order: Order) => <OrderCard key={order._id} order={order} stage={4} status="Completed" actions={<a className="order-action secondary" href="/products">Buy again</a>} />)}{(!visible || visible.length === 0) && <EmptyOrders title="No completed orders" text="Delivered orders will be saved here." />}</TabPanel>; }
