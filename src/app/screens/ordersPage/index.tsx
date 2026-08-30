import { useCallback, useEffect, useMemo, useState, SyntheticEvent } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import SearchRounded from "@mui/icons-material/SearchRounded";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import HeadsetMicOutlined from "@mui/icons-material/HeadsetMicOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import CancelledOrders from "./CancelledOrders";
import { setPausedOrders, setProcessOrders, setFinishedOrders, setCancelledOrders } from "./slice";
import { retrieveCancelledOrders, retrieveFinishedOrders, retrievePausedOrders, retrieveProcessOrders } from "./selector";
import { OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MapPinIcon } from "../../components/icons/TechanorIcons";
import "../../../css/order.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { sweetErrorHandling } from "../../../lib/sweetAlert";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { orderBuilder, authMember } = useGlobals();
  const pausedOrders = useAppSelector(retrievePausedOrders);
  const processOrders = useAppSelector(retrieveProcessOrders);
  const finishedOrders = useAppSelector(retrieveFinishedOrders);
  const cancelledOrders = useAppSelector(retrieveCancelledOrders);
  const [value, setValue] = useState("1");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [orderInquiry] = useState<OrderInquiry>({ page: 1, limit: 5, orderStatus: OrderStatus.PAUSE });

  const loadOrders = useCallback(async () => {
    if (!authMember) return;
    setIsLoading(true);
    setLoadError(false);
    const service = new OrderService();
    try {
      const [paused, process, finished, cancelled] = await Promise.all([
        service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE }),
        service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS }),
        service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH }),
        service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.DELETE }),
      ]);
      dispatch(setPausedOrders(Array.isArray(paused) ? paused : []));
      dispatch(setProcessOrders(Array.isArray(process) ? process : []));
      dispatch(setFinishedOrders(Array.isArray(finished) ? finished : []));
      dispatch(setCancelledOrders(Array.isArray(cancelled) ? cancelled : []));
    } catch (err) {
      setLoadError(true);
      sweetErrorHandling(err).then();
    } finally {
      setIsLoading(false);
    }
  }, [authMember, dispatch, orderInquiry]);

  useEffect(() => { loadOrders(); }, [loadOrders, orderBuilder, refreshKey]);

  useEffect(() => { if (!authMember) history.replace("/"); }, [authMember, history]);

  const counts = useMemo(() => ({ paused: pausedOrders?.length || 0, process: processOrders?.length || 0, finished: finishedOrders?.length || 0, cancelled: cancelledOrders?.length || 0 }), [pausedOrders, processOrders, finishedOrders, cancelledOrders]);
  const handleChange = (_event: SyntheticEvent, newValue: string) => setValue(newValue);
  const avatar = authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg";

  return <main className="order-page"><section className="orders-dashboard">
    <header className="orders-dashboard-header"><div className="orders-title"><span>ORDER CENTER</span><h1>My Orders</h1><p>Track purchases, payments and deliveries in one place.</p></div></header>
    <div className="orders-dashboard-grid"><div className="burak-orders-main">{isLoading ? <div className="orders-request-state" aria-live="polite"><span className="orders-loader"/><h3>Loading your orders</h3><p>Please wait while we prepare your order history.</p></div> : loadError ? <div className="orders-request-state error"><h3>Orders could not be loaded</h3><p>Check your connection and try again.</p><button type="button" onClick={() => setRefreshKey((value) => value + 1)}>Try again</button></div> : <TabContext value={value}><Box className="burak-order-tabs"><Tabs value={value} onChange={handleChange} aria-label="Order status">
      <Tab label={<span>Awaiting Payment <b>{counts.paused}</b></span>} value="1"/><Tab label={<span>Processing <b>{counts.process}</b></span>} value="2"/><Tab label={<span>Completed <b>{counts.finished}</b></span>} value="3"/><Tab label={<span>Cancelled <b>{counts.cancelled}</b></span>} value="4"/>
    </Tabs><div className="orders-toolbar"><label className="orders-search"><SearchRounded/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders" aria-label="Search orders"/></label><label className="orders-date-filter"><CalendarTodayOutlined/><select value={dateRange} onChange={(e) => setDateRange(e.target.value)} aria-label="Filter orders by date"><option value="all">All dates</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label></div></Box><PausedOrders setValue={setValue} search={search} dateRange={dateRange}/><ProcessOrders setValue={setValue} search={search} dateRange={dateRange}/><FinishedOrders search={search} dateRange={dateRange}/><CancelledOrders search={search} dateRange={dateRange}/></TabContext>}</div>
    <aside className="burak-orders-aside"><div className="burak-profile-card"><small>YOUR ACCOUNT</small><img src={avatar} alt={authMember?.memberNick || "Account"}/><h2>{authMember?.memberNick}</h2><span>{authMember?.memberType}</span><div className="profile-details"><p>{authMember?.memberEmail ? <EmailOutlined/> : <PhoneOutlined/>}{authMember?.memberEmail || authMember?.memberPhone}</p><p><MapPinIcon />{authMember?.memberAddress || "Address not added"}</p></div></div>
      <div className="orders-support-card"><HeadsetMicOutlined/><div><strong>Need help?</strong><p>Contact our support team about your order.</p><a href="/help">Contact Support →</a></div></div>
      <div className="orders-support-card orders-shipping-card"><LocalShippingOutlined/><div><strong>Free shipping</strong><p>Free delivery on orders over $79.</p><a href="/products">Shop products →</a></div></div>
    </aside></div>
  </section></main>;
}
