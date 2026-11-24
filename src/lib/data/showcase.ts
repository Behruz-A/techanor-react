import { ProductCategory } from "../../constants/enums";
import { ShowcaseSlide } from "../types/showcase";

// Editorial banners, independent of backend catalog records and prices.
export const showcaseSlides: ShowcaseSlide[] = [
  {
    id: "xiaomi-book-air",
    title: "Xiaomi Book Air",
    subtitle: "Laptops & tablets",
    image: "/img/showcase/xiaomi-book-air.jpg",
    imageAlt: "Two tablets with blue covers and detachable keyboards",
    href: `/products?${new URLSearchParams({ category: ProductCategory.LAPTOP })}`,
  },
  {
    id: "headphones",
    title: "Headphones",
    subtitle: "For music and gaming",
    image: "/img/showcase/headphones.jpg",
    imageAlt: "Orange over-ear headphones with black cushions",
    href: `/products?${new URLSearchParams({ category: ProductCategory.AUDIO })}`,
  },
  {
    id: "drone-mini",
    title: "Drone Mini",
    subtitle: "Discover new perspectives",
    image: "/img/showcase/drone-mini.jpg",
    imageAlt: "Blue and black quadcopter drone with four propellers",
    href: `/products?${new URLSearchParams({ search: "drone" })}`,
  },
];
