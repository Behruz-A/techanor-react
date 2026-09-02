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
    try {
      const orderItems: OrderItemInput[] = input.map((cartItem: CartItem) => {
        return {
          itemQuantity: cartItem.quantity,
          productId: cartItem._id,
        };
      });

      const url = `${this.path}/order/create`;
      const result = await axios.post(url, { items: orderItems, deliveryAddress, deliveryMethod }, {
        withCredentials: true,
      });

      return result.data;
    } catch (err) {
      throw err;
    }
  }

  public async getMyOrders(input: OrderInquiry): Promise<Order[]> {
    try {
      // axios.defaults.withCredentials = true;
      const url = `${this.path}/order/all`;
      const query = new URLSearchParams({
        page: String(input.page),
        limit: String(input.limit),
        orderStatus: input.orderStatus,
      });

      const result = await axios.get(`${url}?${query.toString()}`, { withCredentials: true });
      return result.data;
    } catch (err) {
      throw err;
    }
  }

  public async updateOrder(input: OrderUpdateInput): Promise<Order> {
    try {
      const url = `${this.path}/order/update`;
      const result = await axios.post(url, input, { withCredentials: true });
      return result.data;
    } catch (err) {
      throw err;
    }
  }
}

export default OrderService;
