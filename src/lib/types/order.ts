import { OrderStatus } from "../enums/order.enum";
import { Product } from "./product";

export interface OrderItemInput {
  itemQuantity: number;
  productId: string;
  orderId?: string;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  note?: string;
}

export type DeliveryMethod = "STANDARD" | "EXPRESS";

export interface OrderItem {
  _id: string;
  itemQuantity: number;
  itemPrice: number;
  orderId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  memberId: string;
  deliveryAddress: DeliveryAddress;
  deliveryMethod: DeliveryMethod;
  createdAt: Date;
  updatedAt: Date;
  /**  from aggregations*/
  orderItems: OrderItem[];
  productData: Product[];
}

export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus: OrderStatus;
}

export interface OrderUpdateInput {
  orderId: string;
  orderStatus: OrderStatus;
}
