import { ProductCategory } from "../../constants/enums";
import { HeroSlide } from "../types/hero";

export const heroSlides: HeroSlide[] = [
  {
    id: "computers",
    title: ["Computers up", "to - 15% off"],
    description: "The biggest risk is a missed opportunity.",
    image: "/img/hero/desktop.jpg",
    imageAlt: "Desktop computer with an orange desert wallpaper, keyboard, and mouse",
    category: ProductCategory.LAPTOP,
  },
  {
    id: "laptops",
    title: ["Laptops up to", "- 20% off"],
    description: "The biggest risk is a missed opportunity.",
    image: "/img/hero/laptops.jpg",
    mobileImage: "/img/hero/laptops-mobile.jpg",
    imageAlt: "Silver and blue laptops on a light background",
    category: ProductCategory.LAPTOP,
  },
  {
    id: "smartphones",
    title: ["Smartphones", "up to - 30% off"],
    description: "The biggest risk is a missed opportunity.",
    image: "/img/hero/smartphones.jpg",
    imageAlt: "Three smartphones with blue screens",
    category: ProductCategory.SMARTPHONE,
  },
];
