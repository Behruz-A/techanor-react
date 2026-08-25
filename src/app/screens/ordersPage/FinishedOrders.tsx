import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { Order } from "../../../lib/types/order";
import { EmptyOrders, OrderCard } from "./OrderCard";

const retriever = createSelector(retrieveFinishedOrders, (finishedOrders) => ({ finishedOrders }));
export default function FinishedOrders() { const { finishedOrders } = useSelector(retriever); return <TabPanel value="3" className="orders-tab-panel">{finishedOrders?.map((order: Order) => <OrderCard key={order._id} order={order} stage={4} status="Completed" actions={<a className="order-action secondary" href="/products">Buy again</a>} />)}{(!finishedOrders || finishedOrders.length === 0) && <EmptyOrders title="No completed orders" text="Delivered orders will be saved here." />}</TabPanel>; }
