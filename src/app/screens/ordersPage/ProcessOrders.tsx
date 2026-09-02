import TabPanel from "@mui/lab/TabPanel";
import { createSelector } from "reselect";
import { retrieveProcessOrders } from "./selector";
import { Messages } from "../../../lib/config";
import { Order, OrderUpdateInput } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { sweetConfirm, sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import { EmptyOrders, OrderCard } from "./OrderCard";
import { MouseEvent, useState } from "react";
import { useAppSelector } from "../../hooks";

const retriever = createSelector(retrieveProcessOrders, (processOrders) => ({ processOrders }));
export default function ProcessOrders({ setValue, search = "", dateRange = "all" }: { setValue: (input: string) => void; search?: string; dateRange?: string }) {
  const { authMember, setOrderBuilder } = useGlobals(); const { processOrders } = useAppSelector(retriever);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const finish = async (e: MouseEvent<HTMLButtonElement>) => { const orderId = e.currentTarget.value; try { if (!authMember) throw new Error(Messages.error2); if (updatingOrderId) return; const input: OrderUpdateInput = { orderId, orderStatus: OrderStatus.FINISH }; const confirmed = await sweetConfirm("Confirm delivery", "Confirm that your order arrived safely. It will be moved to completed orders.", "Yes, received", "success"); if (confirmed) { setUpdatingOrderId(orderId); await new OrderService().updateOrder(input); setValue("3"); setOrderBuilder(new Date()); } } catch (err) { sweetErrorHandling(err).then(); } finally { setUpdatingOrderId(null); } };
  const visible = processOrders?.filter((order: Order) => { const term = search.toLowerCase(); const matchesSearch = !term || order._id.toLowerCase().includes(term) || order.productData?.some((product) => product.productName.toLowerCase().includes(term)); const matchesDate = dateRange === "all" || Date.now() - new Date(order.createdAt).getTime() <= Number(dateRange) * 86400000; return matchesSearch && matchesDate; });
  return <TabPanel value="2" className="orders-tab-panel">{visible?.map((order: Order) => <OrderCard key={order._id} order={order} stage={2} status="Processing" actions={<button className="order-action primary" value={order._id} onClick={finish} disabled={updatingOrderId === order._id}>{updatingOrderId === order._id ? "Updating..." : "Confirm delivery"}</button>} />)}{(!visible || visible.length === 0) && <EmptyOrders title="Nothing in progress" text="Paid and processing orders will appear here." />}</TabPanel>;
}
