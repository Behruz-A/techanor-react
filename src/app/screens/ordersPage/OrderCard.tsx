import { ReactNode } from "react";
import { CheckCircleOutlineRounded, Inventory2Outlined, LocalShippingOutlined, ScheduleRounded } from "@mui/icons-material";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";

interface OrderCardProps { order: Order; stage: 1 | 2 | 4; status: string; actions?: ReactNode; }

export function OrderCard({ order, stage, status, actions }: OrderCardProps) {
  const date = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const steps = [{ label: "Order placed", icon: <ScheduleRounded /> }, { label: "Processing", icon: <Inventory2Outlined /> }, { label: "In transit", icon: <LocalShippingOutlined /> }, { label: "Completed", icon: <CheckCircleOutlineRounded /> }];
  return <article className="modern-order-card">
    <header className="modern-order-header"><div><small>ORDER</small><strong>#{order._id.slice(-8).toUpperCase()}</strong><span>{date}</span></div><div><span className={`order-status status-${stage}`}>{status}</span><strong>${order.orderTotal.toLocaleString()}</strong></div></header>
    <div className="modern-order-items">{order.orderItems?.map((item: OrderItem) => {
      const product: Product | undefined = order.productData?.find((entry: Product) => item.productId === entry._id);
      if (!product) return null;
      const rawImage = product.productImages?.[0] || "";
      const image = rawImage.startsWith("/") ? rawImage : `${serverApi}/${rawImage}`;
      return <div className="modern-order-item" key={item._id}><img src={image} alt={product.productName}/><div><strong>{product.productName}</strong><span>${item.itemPrice} × {item.itemQuantity}</span></div><b>${(item.itemPrice * item.itemQuantity).toLocaleString()}</b></div>;
    })}</div>
    <div className="order-progress">{steps.map((step, index) => <div className={index < stage ? "active" : ""} key={step.label}><span>{step.icon}</span><small>{step.label}</small></div>)}</div>
    <footer className="modern-order-footer"><span>Delivery <b>{order.orderDelivery ? `$${order.orderDelivery}` : "Free"}</b></span><div>{actions}</div></footer>
  </article>;
}

export function EmptyOrders({ title, text }: { title: string; text: string }) {
  return <div className="orders-empty"><span><Inventory2Outlined/></span><h3>{title}</h3><p>{text}</p></div>;
}
