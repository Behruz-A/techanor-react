import {
  ProductBrand,
  ProductCategory,
  ProductCondition,
  ProductMemory,
  ProductScreenSize,
  ProductStatus,
} from "../../constants/enums";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productName: string;
  productSku?: string;
  productPrice: number;
  productLeftCount: number;
  productCondition?: ProductCondition;
  productCategory?: ProductCategory;
  productBrand?: ProductBrand;
  productMemory?: ProductMemory;
  productScreenSize?: ProductScreenSize;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  productSales?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateInput {
  productStatus?: ProductStatus;
  productCondition: ProductCondition;
  productCategory: ProductCategory;
  productBrand?: ProductBrand;
  productMemory?: ProductMemory;
  productScreenSize?: ProductScreenSize;
  productName: string;
  productSku?: string;
  productPrice: number;
  productLeftCount: number;
  productDesc?: string;
  productImages?: File[];
}

export interface ProductUpdateInput {
  productStatus?: ProductStatus;
  productCondition?: ProductCondition;
  productCategory?: ProductCategory;
  productBrand?: ProductBrand;
  productMemory?: ProductMemory;
  productScreenSize?: ProductScreenSize;
  productName?: string;
  productSku?: string;
  productPrice?: number;
  productLeftCount?: number;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}

export interface ProductFilters {
  order: string;
  page: number;
  limit: number;
  productCondition?: ProductCondition;
  productCategory?: ProductCategory;
  productBrand?: ProductBrand;
  productMemory?: ProductMemory;
  productScreenSize?: ProductScreenSize;
  search?: string;
}

export type ProductInquiry = ProductFilters;
