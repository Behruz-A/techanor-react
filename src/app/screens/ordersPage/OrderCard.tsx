import { ReactNode, useState } from "react";
import { CheckCircleOutlineRounded, Inventory2Outlined, LocalShippingOutlined, ScheduleRounded } from "@mui/icons-material";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";

interface OrderCardProps { order: Order; stage: 0 | 1 | 2 | 4; status: string; actions?: ReactNode; }

const resolveImage = (image?: string) => {
  if (!image) return "/icons/default-product.svg";
  return image.startsWith("/") || image.startsWith("http") ? image : `${serverApi}/${image}`;
};

export function OrderCard({ order, stage, status, actions }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const steps = [{ label: "Order placed", icon: <ScheduleRounded /> }, { label: "Processing", icon: <Inventory2Outlined /> }, { label: "In transit", icon: <LocalShippingOutlined /> }, { label: "Completed", icon: <CheckCircleOutlineRounded /> }];
  const firstItem = order.orderItems?.[0];
  const firstProduct = order.productData?.find((product: Product) => product._id === firstItem?.productId);
  const itemCount = order.orderItems?.reduce((sum, item) => sum + item.itemQuantity, 0) || 0;

  return <article className={`modern-order-card${expanded ? " expanded" : ""}`}>
    <header className="modern-order-header">
      <img className="order-preview" src={resolveImage(firstProduct?.productImages?.[0])} alt="" />
      <div className="order-identity"><small>ORDER #{order._id.slice(-8).toUpperCase()}</small><strong>{firstProduct?.productName || "Techanor order"}</strong><span>{date} · {itemCount} {itemCount === 1 ? "item" : "items"}</span></div>
      <span className={`order-status status-${stage}`}>{status}</span>
      <div className="order-total"><small>TOTAL</small><strong>${order.orderTotal.toLocaleString()}</strong></div>
      <button className="order-details-toggle" type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>{expanded ? "Hide details" : "View details"}<span>›</span></button>
    </header>
    {expanded && <>
      <div className="modern-order-items">{order.orderItems?.map((item: OrderItem) => {
        const product = order.productData?.find((entry: Product) => item.productId === entry._id);
        if (!product) return null;
        return <div className="modern-order-item" key={item._id}><img src={resolveImage(product.productImages?.[0])} alt={product.productName}/><div><strong>{product.productName}</strong><span>${item.itemPrice} × {item.itemQuantity}</span></div><b>${(item.itemPrice * item.itemQuantity).toLocaleString()}</b></div>;
      })}</div>
      {stage > 0 && <div className="order-progress">{steps.map((step, index) => <div className={index < stage ? "active" : ""} key={step.label}><span>{step.icon}</span><small>{step.label}</small></div>)}</div>}
      <footer className="modern-order-footer"><span>Delivery <b>{order.orderDelivery ? `$${order.orderDelivery}` : "Free"}</b></span><div>{actions}</div></footer>
    </>}
  </article>;
}

export function EmptyOrders({ title, text }: { title: string; text: string }) {
  return <div className="orders-empty"><div className="orders-empty-copy"><span><Inventory2Outlined/></span><h3>{title}</h3><p>{text}</p><a href="/products">Browse products <b>→</b></a></div><div className="orders-empty-steps"><div><b>01</b><strong>Discover</strong><small>Find the right tech for you</small></div><div><b>02</b><strong>Order securely</strong><small>Review and confirm checkout</small></div><div><b>03</b><strong>Track delivery</strong><small>Follow every status update</small></div></div></div>;
}
