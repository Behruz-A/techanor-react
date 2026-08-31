/** Application state shared by typed selectors. */

import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";
import { BlogPost } from "./blog";

export interface AppRootState {
  homePage: HomePageState;
  productsPage: ProductsPageState;
  ordersPage: OrdersPageState;
  blogPage: BlogPageState;
}
/**HOME PAGE */
export interface HomePageState {
  trendingDeals: Product[];
}
/**PRODUCTS PAGE */
export interface ProductsPageState {
  restaurant: Member | null;
  chosenProduct: Product | null;
  products: Product[];
}
/**ORDERS PAGE */
export interface OrdersPageState {
  pausedOrders: Order[];
  processOrders: Order[];
  finishedOrders: Order[];
  cancelledOrders: Order[];
}

/**BLOG PAGE */
export interface BlogPageState {
  blogs: BlogPost[];
  chosenBlog: BlogPost | null;
}
