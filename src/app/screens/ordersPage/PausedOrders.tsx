import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Messages } from "../../../lib/config";
import { Order, OrderUpdateInput } from "../../../lib/types/order";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { EmptyOrders, OrderCard } from "./OrderCard";

const retriever = createSelector(retrievePausedOrders, (pausedOrders) => ({ pausedOrders }));
export default function PausedOrders({ setValue }: { setValue: (input: string) => void }) {
  const { authMember, setOrderBuilder } = useGlobals(); const { pausedOrders } = useSelector(retriever);
  const update = async (e: T, status: OrderStatus) => { try { if (!authMember) throw new Error(Messages.error2); const input: OrderUpdateInput = { orderId: e.currentTarget.value, orderStatus: status }; const message = status === OrderStatus.DELETE ? "Cancel this order?" : "Proceed with secure payment?"; if (window.confirm(message)) { await new OrderService().updateOrder(input); if (status === OrderStatus.PROCESS) setValue("2"); setOrderBuilder(new Date()); } } catch (err) { sweetErrorHandling(err).then(); } };
  return <TabPanel value="1" className="orders-tab-panel">{pausedOrders?.map((order: Order) => <OrderCard key={order._id} order={order} stage={1} status="Awaiting payment" actions={<><button className="order-action secondary" value={order._id} onClick={(e) => update(e, OrderStatus.DELETE)}>Cancel</button><button className="order-action primary" value={order._id} onClick={(e) => update(e, OrderStatus.PROCESS)}>Pay securely</button></>} />)}{(!pausedOrders || pausedOrders.length === 0) && <EmptyOrders title="No pending orders" text="Your unpaid orders will appear here." />}</TabPanel>;
}
