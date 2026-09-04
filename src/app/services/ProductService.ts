import axios from "axios";
import { serverApi } from "../../lib/config";
import { Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getProducts(input: ProductInquiry): Promise<Product[]> {
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

    const url = `${this.path}/product/all?${params.toString()}`;

    const result = await axios.get<Product[]>(url, { timeout: 10000 });
    return result.data;
  }

  public async getProduct(productId: string): Promise<Product> {
    const url = `${this.path}/product/${productId}`;
    const result = await axios.get<Product>(url, { timeout: 10000 });
    return result.data;
  }

  public async getBestSellers(limit = 3): Promise<Product[]> {
    const params = new URLSearchParams({ limit: String(limit) });
    const url = `${this.path}/product/best-sellers?${params.toString()}`;
    const result = await axios.get<Product[]>(url, { timeout: 10000 });
    return result.data;
  }
}

export default ProductService;
