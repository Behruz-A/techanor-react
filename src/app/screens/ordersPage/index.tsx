import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import SearchRounded from "@mui/icons-material/SearchRounded";
import { Box, Tab, Tabs } from "@mui/material";
import { useHistory } from "react-router-dom";

import { OrderStatus } from "../../../lib/enums/order.enum";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderInquiry } from "../../../lib/types/order";
import "../../../css/order.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import CancelledOrders from "./CancelledOrders";
import FinishedOrders from "./FinishedOrders";
import { EmptyOrders, OrderCard } from "./OrderCard";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import { retrieveCancelledOrders, retrieveFinishedOrders, retrievePausedOrders, retrieveProcessOrders } from "./selector";
import { setCancelledOrders, setFinishedOrders, setPausedOrders, setProcessOrders } from "./slice";

const PAGE_SIZE = 50;

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { orderBuilder, authMember, authReady } = useGlobals();
  const pausedOrders = useAppSelector(retrievePausedOrders);
  const processOrders = useAppSelector(retrieveProcessOrders);
  const finishedOrders = useAppSelector(retrieveFinishedOrders);
  const cancelledOrders = useAppSelector(retrieveCancelledOrders);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [orderInquiry] = useState<OrderInquiry>({ page: 1, limit: PAGE_SIZE, orderStatus: OrderStatus.PAUSE });

  const loadOrders = useCallback(async () => {
    if (!authMember) return;
    setIsLoading(true);
    setLoadError(false);
    const service = new OrderService();
    try {
      const [paused, processing, finished, cancelled] = await Promise.all([
        service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE }),
        service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS }),
        service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH }),
        service.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.DELETE }),
      ]);
      dispatch(setPausedOrders(Array.isArray(paused) ? paused : []));
      dispatch(setProcessOrders(Array.isArray(processing) ? processing : []));
      dispatch(setFinishedOrders(Array.isArray(finished) ? finished : []));
      dispatch(setCancelledOrders(Array.isArray(cancelled) ? cancelled : []));
    } catch (error) {
      setLoadError(true);
      sweetErrorHandling(error).then();
    } finally {
      setIsLoading(false);
    }
  }, [authMember, dispatch, orderInquiry]);

  useEffect(() => { loadOrders(); }, [loadOrders, orderBuilder, refreshKey]);
  useEffect(() => { if (authReady && !authMember) history.replace("/"); }, [authMember, authReady, history]);

  const counts = useMemo(() => ({
    paused: pausedOrders.length,
    process: processOrders.length,
    finished: finishedOrders.length,
    cancelled: cancelledOrders.length,
  }), [pausedOrders, processOrders, finishedOrders, cancelledOrders]);

  const allOrders = useMemo(() => [
    ...pausedOrders.map((order) => ({ order, stage: 1 as const, status: "Awaiting payment" })),
    ...processOrders.map((order) => ({ order, stage: 2 as const, status: "Processing" })),
    ...finishedOrders.map((order) => ({ order, stage: 4 as const, status: "Completed" })),
    ...cancelledOrders.map((order) => ({ order, stage: 0 as const, status: "Cancelled" })),
  ].sort((a, b) => new Date(b.order.createdAt).getTime() - new Date(a.order.createdAt).getTime()), [pausedOrders, processOrders, finishedOrders, cancelledOrders]);

  const visibleHistory = useMemo(() => allOrders.filter(({ order }) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || order._id.toLowerCase().includes(term)
      || order.productData?.some((product) => product.productName.toLowerCase().includes(term));
    const matchesDate = dateRange === "all"
      || Date.now() - new Date(order.createdAt).getTime() <= Number(dateRange) * 86400000;
    return matchesSearch && matchesDate;
  }), [allOrders, search, dateRange]);

  const handleChange = (_event: SyntheticEvent, newValue: string) => setActiveFilter(newValue);

  if (!authReady) return <main className="orders-request-state" role="status">Loading your account...</main>;
  if (!authMember) return null;

  return (
    <main className="order-page">
      <section className="orders-dashboard">
        <header className="orders-dashboard-header">
          <div className="orders-title"><span>ORDER HISTORY</span><h1>My Orders</h1><p>Review and track all your purchases in one place.</p></div>
          <button className="orders-shop-button" type="button" onClick={() => history.push("/products")}>Continue shopping <b>→</b></button>
        </header>

        <div className="burak-orders-main">
          {isLoading ? <div className="orders-request-state" aria-live="polite"><span className="orders-loader"/><h3>Loading your orders</h3><p>Please wait while we prepare your order history.</p></div> : loadError ? <div className="orders-request-state error"><h3>Orders could not be loaded</h3><p>Check your connection and try again.</p><button type="button" onClick={() => setRefreshKey((current) => current + 1)}>Try again</button></div> : (
            <TabContext value={activeFilter}>
              <Box className="burak-order-tabs">
                <Tabs value={activeFilter} onChange={handleChange} aria-label="Filter order history">
                  <Tab label={<span><strong>All orders</strong><b>{allOrders.length}</b></span>} value="all"/>
                  <Tab label={<span><strong>Pending</strong><b>{counts.paused}</b></span>} value="1"/>
                  <Tab label={<span><strong>Processing</strong><b>{counts.process}</b></span>} value="2"/>
                  <Tab label={<span><strong>Completed</strong><b>{counts.finished}</b></span>} value="3"/>
                  <Tab className="cancelled-history-tab" label={<span><strong>Cancelled</strong><b>{counts.cancelled}</b></span>} value="4"/>
                </Tabs>
                <div className="orders-toolbar"><label className="orders-search"><SearchRounded/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by product or order number" aria-label="Search orders"/></label><label className="orders-date-filter"><CalendarTodayOutlined/><select value={dateRange} onChange={(event) => setDateRange(event.target.value)} aria-label="Filter orders by date"><option value="all">All dates</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label></div>
              </Box>
              <TabPanel value="all" className="orders-tab-panel">{visibleHistory.map(({ order, stage, status }) => <OrderCard key={order._id} order={order} stage={stage} status={status}/>)}{visibleHistory.length === 0 && <EmptyOrders title="No orders yet" text="Your order history will appear here after your first purchase."/>}</TabPanel>
              <PausedOrders setValue={setActiveFilter} search={search} dateRange={dateRange}/>
              <ProcessOrders setValue={setActiveFilter} search={search} dateRange={dateRange}/>
              <FinishedOrders search={search} dateRange={dateRange}/>
              <CancelledOrders search={search} dateRange={dateRange}/>
            </TabContext>
          )}
        </div>
      </section>
    </main>
  );
}
