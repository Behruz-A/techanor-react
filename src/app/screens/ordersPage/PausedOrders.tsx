import TabPanel from "@mui/lab/TabPanel";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Messages } from "../../../lib/config";
import { Order, OrderUpdateInput } from "../../../lib/types/order";
import { sweetConfirm, sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { EmptyOrders, OrderCard } from "./OrderCard";
import { MouseEvent, useState } from "react";
import { useAppSelector } from "../../hooks";

const retriever = createSelector(retrievePausedOrders, (pausedOrders) => ({ pausedOrders }));
export default function PausedOrders({ setValue, search = "", dateRange = "all" }: { setValue: (input: string) => void; search?: string; dateRange?: string }) {
  const { authMember, setOrderBuilder } = useGlobals(); const { pausedOrders } = useAppSelector(retriever);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const update = async (e: MouseEvent<HTMLButtonElement>, status: OrderStatus) => { const orderId = e.currentTarget.value; try { if (!authMember) throw new Error(Messages.error2); if (updatingOrderId) return; const input: OrderUpdateInput = { orderId, orderStatus: status }; const isCancel = status === OrderStatus.DELETE; const confirmed = await sweetConfirm(isCancel ? "Cancel this order?" : "Confirm secure payment", isCancel ? "The order will be cancelled and reserved stock will be returned." : "This order will move to processing after payment confirmation.", isCancel ? "Cancel order" : "Confirm payment", isCancel ? "danger" : "default"); if (confirmed) { setUpdatingOrderId(orderId); await new OrderService().updateOrder(input); if (status === OrderStatus.PROCESS) setValue("2"); setOrderBuilder(new Date()); } } catch (err) { sweetErrorHandling(err).then(); } finally { setUpdatingOrderId(null); } };
  const visible = pausedOrders?.filter((order: Order) => { const term = search.toLowerCase(); const matchesSearch = !term || order._id.toLowerCase().includes(term) || order.productData?.some((product) => product.productName.toLowerCase().includes(term)); const matchesDate = dateRange === "all" || Date.now() - new Date(order.createdAt).getTime() <= Number(dateRange) * 86400000; return matchesSearch && matchesDate; });
  return <TabPanel value="1" className="orders-tab-panel">{visible?.map((order: Order) => <OrderCard key={order._id} order={order} stage={1} status="Awaiting payment" actions={<><button type="button" className="order-action secondary" value={order._id} onClick={(e) => update(e, OrderStatus.DELETE)} disabled={updatingOrderId === order._id}>{updatingOrderId === order._id ? "Updating..." : "Cancel"}</button><button type="button" className="order-action primary" value={order._id} onClick={(e) => update(e, OrderStatus.PROCESS)} disabled={updatingOrderId === order._id}>{updatingOrderId === order._id ? "Updating..." : "Pay securely"}</button></>} />)}{(!visible || visible.length === 0) && <EmptyOrders title="No pending orders" text="Your unpaid orders will appear here." />}</TabPanel>;
}
