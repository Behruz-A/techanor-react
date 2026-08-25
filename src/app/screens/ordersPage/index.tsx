import { useEffect, useState, SyntheticEvent } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { useDispatch } from "react-redux";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
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

  if (!authMember) history.push("/");
  const handleChange = (_event: SyntheticEvent, newValue: string) => setValue(newValue);
  const avatar = authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg";

  return <main className="order-page">
    <section className="order-journey-hero"><div className="order-journey-inner">
      <span className="order-journey-eyebrow">TECHANOR ORDER CENTER</span><h1>TRACK EVERY <em>MOMENT.</em></h1>
      <p>One clear place to manage purchases and follow each product to your door.</p>
    </div></section>

    <section className="burak-orders-shell"><div className="burak-orders-main">
      <TabContext value={value}><Box className="burak-order-tabs"><Tabs value={value} onChange={handleChange} aria-label="Order status">
        <Tab label="AWAITING PAYMENT" value="1"/><Tab label="IN PROGRESS" value="2"/><Tab label="ORDER HISTORY" value="3"/>
      </Tabs></Box><PausedOrders setValue={setValue}/><ProcessOrders setValue={setValue}/><FinishedOrders/></TabContext>
    </div><aside className="burak-orders-aside">
      <div className="burak-profile-card"><img src={avatar} alt={authMember?.memberNick || "Account"}/><h2>{authMember?.memberNick}</h2><span>{authMember?.memberType}</span><div><LocationOnOutlined/>{authMember?.memberAddress || "Do not exist"}</div></div>
      <div className="burak-payment-card"><input placeholder="Card number : **** 4090 2002 7495"/><div><input placeholder="07 / 24"/><input placeholder="CVV : 010"/></div><input placeholder="Justin Robertson"/><figure><img src="/icons/western-card.svg" alt="Western Union"/><img src="/icons/master-card.svg" alt="Mastercard"/><img src="/icons/paypal-card.svg" alt="PayPal"/><img src="/icons/visa-card.svg" alt="Visa"/></figure></div>
    </aside></section>
  </main>;
}
