import { ProductCategory } from "../../constants/enums";

export interface HeroSlide {
  id: string;
  title: [string, string];
  description: string;
  image: string;
  mobileImage?: string;
  imageAlt: string;
  category: ProductCategory;
}
