import axios from "axios";
import { serverApi } from "../../lib/config";
import { Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getProducts(input: ProductInquiry): Promise<Product[]> {
    try {
      const params = new URLSearchParams({
        order: input.order,
        page: String(input.page),
        limit: String(input.limit),
      });
      if (input.productCondition) params.set("productCondition", input.productCondition);
      if (input.productCategory) params.set("productCategory", input.productCategory);
      if (input.productBrand) params.set("productBrand", input.productBrand);
      if (input.productMemory) params.set("productMemory", input.productMemory);
      if (input.productScreenSize) params.set("productScreenSize", input.productScreenSize);
      if (input.search) params.set("search", input.search);

      const url = `${this.path}/admin/product/all?${params.toString()}`;

      const result = await axios.get(url, { withCredentials: true });
      console.log("getProducts", result);

      return result.data;
    } catch (err) {
      console.log("Error, getProducts:", err);
      throw err;
    }
  }

  public async getProduct(productId: string): Promise<Product> {
    try {
      const url = `${this.path}/product/${productId}`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("getProduct", result);

      return result.data;
    } catch (err) {
      console.log("Error, getProducts:", err);
      throw err;
    }
  }
}

export default ProductService;
