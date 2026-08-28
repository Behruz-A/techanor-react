import { Product } from "../../../lib/types/product";
import {
  ProductBrand,
  ProductCategory,
  ProductCondition,
  ProductMemory,
  ProductStatus,
} from "../../../constants/enums";

const createdAt = new Date().toISOString();

export const showcaseProducts: Product[] = [
  { _id: "demo-iphone-17", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.SMARTPHONE, productBrand: ProductBrand.APPLE, productMemory: ProductMemory.GB_256, productName: "iPhone 17 Pro", productPrice: 1199, productLeftCount: 8, productDesc: "A18 Pro chip · 256GB · 5G", productImages: ["/img/iphone17silver.jpg", "/img/iphone17img2.jpg", "/img/iphone17img3.jpg"], productViews: 428, createdAt, updatedAt: createdAt },
  { _id: "demo-galaxy", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.SMARTPHONE, productBrand: ProductBrand.SAMSUNG, productMemory: ProductMemory.GB_256, productName: "Samsung Galaxy", productPrice: 999, productLeftCount: 12, productDesc: "AMOLED display · 256GB · AI camera", productImages: ["/img/samsunggalaxy.jpg"], productViews: 362, createdAt, updatedAt: createdAt },
  { _id: "demo-asus", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.LAPTOP, productBrand: ProductBrand.OTHER, productMemory: ProductMemory.TB_1, productName: "ASUS Performance Laptop", productPrice: 1399, productLeftCount: 5, productDesc: "Intel Core · 16GB RAM · 1TB SSD", productImages: ["/img/Asuslaptop.jpg"], productViews: 301, createdAt, updatedAt: createdAt },
  { _id: "demo-macbook", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.LAPTOP, productBrand: ProductBrand.APPLE, productMemory: ProductMemory.GB_512, productName: "MacBook Air", productPrice: 1099, productLeftCount: 7, productDesc: "Apple silicon · 16GB · 512GB SSD", productImages: ["/img/mackboooook.jpg"], productViews: 516, createdAt, updatedAt: createdAt },
  { _id: "demo-headphones", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.AUDIO, productBrand: ProductBrand.SONY, productName: "Studio Wireless Headphones", productPrice: 249, productLeftCount: 18, productDesc: "Noise cancelling · 40-hour battery", productImages: ["/img/headphonenew.jpg"], productViews: 214, createdAt, updatedAt: createdAt },
  { _id: "demo-airphone", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.AUDIO, productBrand: ProductBrand.APPLE, productName: "True Wireless Earbuds", productPrice: 149, productLeftCount: 24, productDesc: "Spatial audio · Wireless charging", productImages: ["/img/airphone.jpg"], productViews: 187, createdAt, updatedAt: createdAt },
  { _id: "demo-gaming", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.NEW, productCategory: ProductCategory.WEARABLES, productBrand: ProductBrand.OTHER, productName: "Gaming Smart Watch", productPrice: 329, productLeftCount: 9, productDesc: "Performance tracking · GPS · Always-on display", productImages: ["/img/watchhomenavbar.jpg"], productViews: 276, createdAt, updatedAt: createdAt },
  { _id: "demo-camera", productStatus: ProductStatus.PROCESS, productCondition: ProductCondition.USED, productCategory: ProductCategory.OTHERS, productBrand: ProductBrand.SONY, productName: "Mirrorless Camera", productPrice: 899, productLeftCount: 4, productDesc: "4K video · Fast autofocus · Wi-Fi", productImages: ["/img/cameraimg.jpg"], productViews: 198, createdAt, updatedAt: createdAt },
];

export const findShowcaseProduct = (productId: string) =>
  showcaseProducts.find((product) => product._id === productId);
