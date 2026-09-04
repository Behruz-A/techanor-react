import axios from "axios";
import { serverApi } from "../../lib/config";
import { CartItem } from "../../lib/types/search";
import {
  Order,
  DeliveryAddress,
  DeliveryMethod,
  OrderInquiry,
  OrderItemInput,
  OrderUpdateInput,
} from "../../lib/types/order";

class OrderService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async createOrder(input: CartItem[], deliveryAddress: DeliveryAddress, deliveryMethod: DeliveryMethod): Promise<Order> {
    const orderItems: OrderItemInput[] = input.map((cartItem: CartItem) => ({
      itemQuantity: cartItem.quantity,
      productId: cartItem._id,
    }));

    const url = `${this.path}/order/create`;
    const result = await axios.post<Order>(url, { items: orderItems, deliveryAddress, deliveryMethod }, {
      withCredentials: true,
    });

    return result.data;
  }

  public async getMyOrders(input: OrderInquiry): Promise<Order[]> {
    const url = `${this.path}/order/all`;
    const query = new URLSearchParams({
      page: String(input.page),
      limit: String(input.limit),
      orderStatus: input.orderStatus,
    });

    const result = await axios.get<Order[]>(`${url}?${query.toString()}`, { withCredentials: true });
    return result.data;
  }

  public async updateOrder(input: OrderUpdateInput): Promise<Order> {
    const url = `${this.path}/order/update`;
    const result = await axios.post<Order>(url, input, { withCredentials: true });
    return result.data;
  }
}

export default OrderService;
