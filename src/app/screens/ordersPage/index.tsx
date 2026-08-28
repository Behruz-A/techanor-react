import { useEffect, useMemo, useState, SyntheticEvent } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import SearchRounded from "@mui/icons-material/SearchRounded";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import HeadsetMicOutlined from "@mui/icons-material/HeadsetMicOutlined";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { useDispatch, useSelector } from "react-redux";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { retrieveFinishedOrders, retrievePausedOrders, retrieveProcessOrders } from "./selector";
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
  const pausedOrders = useSelector(retrievePausedOrders);
  const processOrders = useSelector(retrieveProcessOrders);
  const finishedOrders = useSelector(retrieveFinishedOrders);
  const [value, setValue] = useState("1");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [orderInquiry] = useState<OrderInquiry>({ page: 1, limit: 5, orderStatus: OrderStatus.PAUSE });

  useEffect(() => {
    const service = new OrderService();
    service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE }).then((data) => dispatch(setPausedOrders(Array.isArray(data) ? data : []))).catch(console.log);
    service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS }).then((data) => dispatch(setProcessOrders(Array.isArray(data) ? data : []))).catch(console.log);
    service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH }).then((data) => dispatch(setFinishedOrders(Array.isArray(data) ? data : []))).catch(console.log);
  }, [dispatch, orderBuilder, orderInquiry]);

  useEffect(() => { if (!authMember) history.replace("/"); }, [authMember, history]);

  const counts = useMemo(() => ({ paused: pausedOrders?.length || 0, process: processOrders?.length || 0, finished: finishedOrders?.length || 0 }), [pausedOrders, processOrders, finishedOrders]);
  const handleChange = (_event: SyntheticEvent, newValue: string) => setValue(newValue);
  const avatar = authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg";

  return <main className="order-page"><section className="orders-dashboard">
    <header className="orders-dashboard-header"><div><h1>My Orders</h1><p>Track and manage all your orders in one place.</p></div><div className="orders-toolbar">
      <label className="orders-search"><SearchRounded/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders" aria-label="Search orders"/></label>
      <label className="orders-date-filter"><CalendarTodayOutlined/><select value={dateRange} onChange={(e) => setDateRange(e.target.value)} aria-label="Filter orders by date"><option value="all">All dates</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label>
    </div></header>
    <div className="orders-dashboard-grid"><div className="burak-orders-main"><TabContext value={value}><Box className="burak-order-tabs"><Tabs value={value} onChange={handleChange} aria-label="Order status">
      <Tab label={<span>Awaiting Payment <b>{counts.paused}</b></span>} value="1"/><Tab label={<span>In Progress <b>{counts.process}</b></span>} value="2"/><Tab label={<span>Completed <b>{counts.finished}</b></span>} value="3"/>
    </Tabs></Box><PausedOrders setValue={setValue} search={search} dateRange={dateRange}/><ProcessOrders setValue={setValue} search={search} dateRange={dateRange}/><FinishedOrders search={search} dateRange={dateRange}/></TabContext></div>
    <aside className="burak-orders-aside"><div className="burak-profile-card"><img src={avatar} alt={authMember?.memberNick || "Account"}/><h2>{authMember?.memberNick}</h2><span>{authMember?.memberType}</span><div className="profile-details"><p>{authMember?.memberEmail ? <EmailOutlined/> : <PhoneOutlined/>}{authMember?.memberEmail || authMember?.memberPhone}</p><p><LocationOnOutlined/>{authMember?.memberAddress || "Address not added"}</p></div></div>
      <div className="orders-support-card"><HeadsetMicOutlined/><div><strong>Need help?</strong><p>Contact our support team about your order.</p><a href="/help">Contact Support →</a></div></div>
    </aside></div>
  </section></main>;
}
