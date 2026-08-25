import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveProcessOrders } from "./selector";
import { Messages } from "../../../lib/config";
import { Order, OrderUpdateInput } from "../../../lib/types/order";
import { T } from "../../../lib/types/common";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import { EmptyOrders, OrderCard } from "./OrderCard";

const retriever = createSelector(retrieveProcessOrders, (processOrders) => ({ processOrders }));
export default function ProcessOrders({ setValue }: { setValue: (input: string) => void }) {
  const { authMember, setOrderBuilder } = useGlobals(); const { processOrders } = useSelector(retriever);
  const finish = async (e: T) => { try { if (!authMember) throw new Error(Messages.error2); const input: OrderUpdateInput = { orderId: e.currentTarget.value, orderStatus: OrderStatus.FINISH }; if (window.confirm("Confirm that you received this order?")) { await new OrderService().updateOrder(input); setValue("3"); setOrderBuilder(new Date()); } } catch (err) { sweetErrorHandling(err).then(); } };
  return <TabPanel value="2" className="orders-tab-panel">{processOrders?.map((order: Order) => <OrderCard key={order._id} order={order} stage={2} status="Processing" actions={<button className="order-action primary" value={order._id} onClick={finish}>Confirm delivery</button>} />)}{(!processOrders || processOrders.length === 0) && <EmptyOrders title="Nothing in progress" text="Paid and processing orders will appear here." />}</TabPanel>;
}
