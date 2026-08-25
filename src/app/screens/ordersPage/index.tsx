import { SyntheticEvent, useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import { CreditCardRounded, LocationOnRounded, LockRounded } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import "../../../css/order.css";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { orderBuilder, authMember } = useGlobals();
  const [value, setValue] = useState("1");
  const [orderInquiry] = useState<OrderInquiry>({ page: 1, limit: 5, orderStatus: OrderStatus.PAUSE });

  useEffect(() => {
    const service = new OrderService();
    service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE }).then((data) => dispatch(setPausedOrders(Array.isArray(data) ? data : []))).catch(console.log);
    service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS }).then((data) => dispatch(setProcessOrders(Array.isArray(data) ? data : []))).catch(console.log);
    service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH }).then((data) => dispatch(setFinishedOrders(Array.isArray(data) ? data : []))).catch(console.log);
  }, [dispatch, orderBuilder, orderInquiry]);

  const handleChange = (_: SyntheticEvent, newValue: string) => setValue(newValue);
  if (!authMember) history.push("/");

  return <main className="order-page"><section className="orders-shell">
    <header className="orders-heading"><div><span>YOUR ACCOUNT</span><h1>My Orders</h1></div><p>Review purchases, complete payments and follow every order from checkout to delivery.</p></header>
    <div className="orders-layout">
      <section className="orders-workspace"><TabContext value={value}>
        <Box className="orders-tabs-wrap"><Tabs value={value} onChange={handleChange} className="orders-tabs" aria-label="Order status"><Tab label="Pending" value="1" /><Tab label="Processing" value="2" /><Tab label="Completed" value="3" /></Tabs></Box>
        <div className="orders-content"><PausedOrders setValue={setValue} /><ProcessOrders setValue={setValue} /><FinishedOrders /></div>
      </TabContext></section>
      <aside className="orders-aside">
        <section className="account-summary-card">
          <div className="account-summary-top"><img src={authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"} alt={authMember?.memberNick || "Account"} /><div><small>Signed in as</small><h2>{authMember?.memberNick}</h2><span>{authMember?.memberType}</span></div></div>
          <div className="account-summary-row"><LocationOnRounded /><span><small>Delivery address</small>{authMember?.memberAddress || "Add your delivery address"}</span></div>
        </section>
        <section className="payment-summary-card">
          <div className="payment-summary-title"><span><CreditCardRounded /> Payment method</span><LockRounded /></div><div className="payment-card-chip" aria-hidden="true" /><strong>•••• &nbsp;•••• &nbsp;•••• &nbsp;7495</strong>
          <div className="payment-card-meta"><span><small>CARD HOLDER</small>{authMember?.memberNick || "Techanor user"}</span><span><small>EXPIRES</small>07/28</span></div>
          <p><LockRounded /> Payment details are encrypted and securely stored.</p>
        </section>
      </aside>
    </div>
  </section></main>;
}
