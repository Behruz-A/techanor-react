export enum ProductStatus { PAUSE = "PAUSE", PROCESS = "PROCESS", DELETE = "DELETE" }
export enum ProductCondition { NEW = "NEW", USED = "USED" }
export enum ProductCategory { LAPTOP = "LAPTOP", SMARTPHONE = "SMARTPHONE", TV = "TV", GAMING = "GAMING", AUDIO = "AUDIO", CASES = "CASES", WEARABLES = "WEARABLES", OTHERS = "OTHERS" }
export enum ProductBrand { APPLE = "APPLE", SAMSUNG = "SAMSUNG", SONY = "SONY", LG = "LG", XIAOMI = "XIAOMI", OTHER = "OTHER" }
export enum ProductMemory { GB_32 = "32GB", GB_64 = "64GB", GB_128 = "128GB", GB_256 = "256GB", GB_512 = "512GB", TB_1 = "1TB", TB_2 = "2TB" }
export enum ProductScreenSize { INCH_24 = "24", INCH_27 = "27", INCH_32 = "32", INCH_43 = "43", INCH_50 = "50", INCH_55 = "55", INCH_65 = "65", INCH_75 = "75", INCH_85 = "85" }
export enum MemberType { USER = "USER", STORE = "STORE" }
export enum MemberStatus { ACTIVE = "ACTIVE", BLOCK = "BLOCK", DELETE = "DELETE" }
export enum AuthProvider { LOCAL = "LOCAL", GOOGLE = "GOOGLE" }
export enum BlogPostStatus { PUBLISHED = "PUBLISHED", DRAFT = "DRAFT", DELETE = "DELETE" }
export enum BlogPostCategory { RECOMMENDED = "RECOMMENDED", NEWS = "NEWS", PRODUCT_GUIDE = "PRODUCT_GUIDE", REVIEWS = "REVIEWS", TECHNOLOGY = "TECHNOLOGY", HOW_TO = "HOW_TO", HUMOR = "HUMOR" }
export enum OrderStatus { PAUSE = "PAUSE", PROCESS = "PROCESS", FINISH = "FINISH", DELETE = "DELETE" }
export enum ViewGroup { PRODUCT = "PRODUCT" }

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = { [ProductStatus.PAUSE]: "Paused", [ProductStatus.PROCESS]: "Active", [ProductStatus.DELETE]: "Deleted" };
export const PRODUCT_CONDITION_LABELS: Record<ProductCondition, string> = { [ProductCondition.NEW]: "New", [ProductCondition.USED]: "Used" };
export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = { [ProductCategory.LAPTOP]: "Laptops", [ProductCategory.SMARTPHONE]: "Smartphones", [ProductCategory.TV]: "TVs", [ProductCategory.GAMING]: "Gaming", [ProductCategory.AUDIO]: "Audio", [ProductCategory.CASES]: "Cases & Accessories", [ProductCategory.WEARABLES]: "Wearables", [ProductCategory.OTHERS]: "Others" };
export const PRODUCT_BRAND_LABELS: Record<ProductBrand, string> = { [ProductBrand.APPLE]: "Apple", [ProductBrand.SAMSUNG]: "Samsung", [ProductBrand.SONY]: "Sony", [ProductBrand.LG]: "LG", [ProductBrand.XIAOMI]: "Xiaomi", [ProductBrand.OTHER]: "Other" };
export const PRODUCT_MEMORY_LABELS: Record<ProductMemory, string> = { [ProductMemory.GB_32]: "32 GB", [ProductMemory.GB_64]: "64 GB", [ProductMemory.GB_128]: "128 GB", [ProductMemory.GB_256]: "256 GB", [ProductMemory.GB_512]: "512 GB", [ProductMemory.TB_1]: "1 TB", [ProductMemory.TB_2]: "2 TB" };
export const PRODUCT_SCREEN_SIZE_LABELS: Record<ProductScreenSize, string> = { [ProductScreenSize.INCH_24]: '24"', [ProductScreenSize.INCH_27]: '27"', [ProductScreenSize.INCH_32]: '32"', [ProductScreenSize.INCH_43]: '43"', [ProductScreenSize.INCH_50]: '50"', [ProductScreenSize.INCH_55]: '55"', [ProductScreenSize.INCH_65]: '65"', [ProductScreenSize.INCH_75]: '75"', [ProductScreenSize.INCH_85]: '85"' };
export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = { [MemberStatus.ACTIVE]: "Active", [MemberStatus.BLOCK]: "Blocked", [MemberStatus.DELETE]: "Deleted" };
export const MEMBER_TYPE_LABELS: Record<MemberType, string> = { [MemberType.USER]: "User", [MemberType.STORE]: "Store/Admin" };
export const AUTH_PROVIDER_LABELS: Record<AuthProvider, string> = { [AuthProvider.LOCAL]: "Email & Password", [AuthProvider.GOOGLE]: "Google" };
export const BLOG_STATUS_LABELS: Record<BlogPostStatus, string> = { [BlogPostStatus.PUBLISHED]: "Published", [BlogPostStatus.DRAFT]: "Draft", [BlogPostStatus.DELETE]: "Deleted" };
export const BLOG_CATEGORY_LABELS: Record<BlogPostCategory, string> = { [BlogPostCategory.RECOMMENDED]: "Recommended", [BlogPostCategory.NEWS]: "News", [BlogPostCategory.PRODUCT_GUIDE]: "Product Guides", [BlogPostCategory.REVIEWS]: "Reviews", [BlogPostCategory.TECHNOLOGY]: "Technology", [BlogPostCategory.HOW_TO]: "How To", [BlogPostCategory.HUMOR]: "Humor" };
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = { [OrderStatus.PAUSE]: "Paused", [OrderStatus.PROCESS]: "Processing", [OrderStatus.FINISH]: "Completed", [OrderStatus.DELETE]: "Cancelled" };
