/** Application state shared by typed selectors. */

import { Order } from "./order";
import { Product } from "./product";
import { BlogPost, BlogCommentList } from "./blog";

export interface AppRootState {
  homePage: HomePageState;
  productsPage: ProductsPageState;
  ordersPage: OrdersPageState;
  blogPage: BlogPageState;
}
/**HOME PAGE */
export interface HomePageState {
  featuredProducts: Product[];
  trendingProducts: Product[];
}
/**PRODUCTS PAGE */
export interface ProductsPageState {
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
  comments: BlogCommentList;
}
